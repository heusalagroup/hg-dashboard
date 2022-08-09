// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ModalState } from "../views/types/ModelState";
import { EmailTokenDTO } from "../../fi/hg/core/auth/email/types/EmailTokenDTO";
import { EmailUtils } from "../../fi/hg/core/utils/EmailUtils";
import { EmailAuthSessionService } from "../../fi/hg/frontend/services/EmailAuthSessionService";
import { useState, useEffect, MouseEvent, FormEvent, ChangeEvent, useCallback } from "react";
import { Loader } from "../../fi/hg/frontend/components/loader/Loader";
import { LogService } from "../../fi/hg/core/LogService";

import {
    FIELD_TEXT_INPUT_CLASS_NAME,
    FIELD_TEXT_LABEL_CLASS_NAME,
    LOGIN_CLASS_NAME,
    LOGIN_FORM_CLASS_NAME,
    TEXT_CENTERED_CLASS_NAME
} from "../../constants/appClassName";
import {
    T_LOGIN,
    T_LOGIN_FORM_EMAIL_FIELD_LABEL,
    T_LOGIN_FORM_EMAIL_FIELD_PLACEHOLDER,
    T_LOGIN_FORM_ERROR_CONTENT,
    T_LOGIN_FORM_ERROR_TITLE,
    T_LOGIN_FORM_SUBMIT_BUTTON_LABEL,
    T_LOGIN_FORM_THANK_YOU_CONTENT,
    T_LOGIN_FORM_THANK_YOU_TITLE,
    T_LOGIN_FORM_VERIFICATION_CODE_FIELD_LABEL,
    T_LOGIN_FORM_VERIFICATION_CODE_FIELD_PLACEHOLDER
} from "../../constants/translation";
import {
    BUTTON_CLASS_NAME,
    DISABLED_BUTTON_CLASS_NAME, FIELD_CLASS_NAME,
    SUBMIT_BUTTON_CLASS_NAME
} from "../../fi/hg/frontend/constants/hgClassName";

import { TFunction } from "i18next";
import './Login.scss';
import { useEventSessionTokenUpdated } from "../../hooks/session/useEventSessionTokenUpdated";

const LOG = LogService.createLogger("Login");

export interface LoginProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function Login (props: LoginProps) {

    const t = props?.t;
    const className = props?.className;

    const [ authenticatedEmailAddress, setAuthenticatedEmailAddress ] = useState<string | undefined>(EmailAuthSessionService.getEmailAddress());
    const [ authenticatedEmailToken, setAuthenticatedEmailToken ] = useState<EmailTokenDTO | undefined>(EmailAuthSessionService.getEmailToken());
    const [ modalState, setModalState ] = useState<ModalState>(authenticatedEmailToken ? ModalState.AUTHENTICATED : ModalState.UNAUTHENTICATED);
    const [ isError, setError ] = useState<boolean>(false);
    const [ code, setCode ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ orderEmailToken, setOrderEmailToken ] = useState<EmailTokenDTO | undefined>(undefined);
    const [ isButtonEnabled, setButtonEnabled ] = useState<boolean>(false);

    const onSessionUpdatedCallback = useCallback(
        () => {
            const token = EmailAuthSessionService.getEmailToken();
            setAuthenticatedEmailToken(token);
            setAuthenticatedEmailAddress(EmailAuthSessionService.getEmailAddress());
            if ( token && modalState !== ModalState.AUTHENTICATED ) {
                setModalState(ModalState.AUTHENTICATED);
            } else if ( modalState !== ModalState.UNAUTHENTICATED ) {
                setModalState(ModalState.UNAUTHENTICATED);
            }
        },
        [

        ]
    );

    useEventSessionTokenUpdated(onSessionUpdatedCallback);

    function voidCallback (event: MouseEvent<HTMLDivElement>) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    function submitCodeForm (event: FormEvent<HTMLFormElement>) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        submitCode(code);
    }

    function onCodeFieldChangeCallback (
        event: ChangeEvent<HTMLInputElement>
    ) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        const value = `${event.target.value}`
        .replace(/[^0-9]+/g, "")
        .substring(0, 4);
        setCode(value);
    }

    function submitEmailForm (event: FormEvent<HTMLFormElement>) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        submitEmail(email);
    }

    function onEmailFieldChangeCallback (
        event: ChangeEvent<HTMLInputElement>
    ) {

        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        const value = `${event.target.value}`.replace(/\s+/, "");

        setEmail(value);

        setButtonEnabled(EmailUtils.isEmailValid(email));

    }

    function submitCode (code: string) {
        if ( !orderEmailToken ) {
            LOG.error(`No order email token detected`);
            return;
        }

        setError(false);
        setModalState(ModalState.VERIFYING_CODE);

        EmailAuthSessionService.verifyEmailCode(orderEmailToken, code)
                               .then(async () => {
                                   const token = EmailAuthSessionService.getEmailToken();

                                   if ( token ) {
                                       setModalState(ModalState.SUBMIT_SUCCESS);
                                   } else {
                                       LOG.error(`No token received: `, token);
                                       setModalState(ModalState.AUTHENTICATING);
                                       setError(true);
                                   }
                               })
                               .catch((err) => {
                                   LOG.error(`Error while authenticating: `, err);
                                   setModalState(ModalState.AUTHENTICATING);
                                   setError(true);
                               });
    }

    function submitCodeButtonClick (event: MouseEvent<HTMLButtonElement>) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        submitCode(code);
    }

    function submitEmailButtonClick (
        event: MouseEvent<HTMLButtonElement>
    ) {
        if ( event ) {
            event.stopPropagation();
            event.preventDefault();
        }

        submitEmail(email);
    }

    function submitEmail (emailAddress: string) {
        setModalState(ModalState.AUTHENTICATING);
        setOrderEmailToken(undefined);
        setError(false);
        EmailAuthSessionService.authenticateEmailAddress(emailAddress)
                               .then((token: EmailTokenDTO) => {
                                   setOrderEmailToken(token);
                               })
                               .catch((err) => {
                                   LOG.error(`Error while authenticating: `, err);
                                   setModalState(ModalState.UNAUTHENTICATED);
                                   setError(true);
                               });
    }

    useEffect(() => {
        setButtonEnabled(isButtonEnabled);
    }, [ setButtonEnabled, isButtonEnabled ]);

    return (
        <div
            className={
                LOGIN_CLASS_NAME +
                (className ? ` ${className}` : "")
            }
            onClick={voidCallback}
        >
            {modalState === ModalState.SUBMIT_SUCCESS ||
            modalState === ModalState.AUTHENTICATED ? (
                <p className={TEXT_CENTERED_CLASS_NAME}>
                    <strong>{t(T_LOGIN_FORM_THANK_YOU_TITLE)}</strong>{" "}
                    {t(T_LOGIN_FORM_THANK_YOU_CONTENT)}
                </p>
            ) : null}

            {modalState === ModalState.VERIFYING_CODE ? <Loader /> : null}

            {modalState === ModalState.UNAUTHENTICATED ||
            modalState === ModalState.AUTHENTICATING ? (
                <div
                    className={
                        LOGIN_FORM_CLASS_NAME + "-container form-container"
                    }
                >
                    <div className="login-title">{t(T_LOGIN)}</div>
                    <form
                        className="form-horizontal form"
                        onSubmit={
                            modalState === ModalState.AUTHENTICATING
                                ? submitCodeForm
                                : submitEmailForm
                        }
                    >
                        {modalState === ModalState.UNAUTHENTICATED ? (
                            <label className={FIELD_CLASS_NAME}>
                                <strong className={FIELD_TEXT_LABEL_CLASS_NAME}>
                                    {t(T_LOGIN_FORM_EMAIL_FIELD_LABEL)}
                                </strong>
                                <input
                                    className={FIELD_TEXT_INPUT_CLASS_NAME}
                                    type="email"
                                    value={
                                        modalState !==
                                        ModalState.UNAUTHENTICATED
                                            ? authenticatedEmailAddress
                                            : email
                                    }
                                    readOnly={
                                        modalState !==
                                        ModalState.UNAUTHENTICATED
                                    }
                                    onChange={onEmailFieldChangeCallback}
                                    placeholder={t(
                                        T_LOGIN_FORM_EMAIL_FIELD_PLACEHOLDER
                                    )}
                                />
                            </label>
                        ) : null}

                        {modalState === ModalState.AUTHENTICATING ? (
                            <label className={FIELD_CLASS_NAME}>
                                <strong className={FIELD_TEXT_LABEL_CLASS_NAME}>
                                    {t(
                                        T_LOGIN_FORM_VERIFICATION_CODE_FIELD_LABEL
                                    )}
                                </strong>
                                <input
                                    className={FIELD_TEXT_INPUT_CLASS_NAME}
                                    type="text"
                                    value={code}
                                    onChange={onCodeFieldChangeCallback}
                                    placeholder={t(
                                        T_LOGIN_FORM_VERIFICATION_CODE_FIELD_PLACEHOLDER
                                    )}
                                />
                            </label>
                        ) : null}

                        <button
                            disabled={ !isButtonEnabled}
                            onClick={
                                modalState === ModalState.AUTHENTICATING
                                    ? submitCodeButtonClick
                                    : submitEmailButtonClick
                            }
                            type={"submit"}
                            className={
                                `${BUTTON_CLASS_NAME} ${SUBMIT_BUTTON_CLASS_NAME}` +
                                (isButtonEnabled
                                    ? ""
                                    : " " + DISABLED_BUTTON_CLASS_NAME)
                            }
                        >
                            {t(T_LOGIN_FORM_SUBMIT_BUTTON_LABEL)}
                        </button>
                    </form>
                </div>
            ) : null}

            {isError ? (
                <p className={TEXT_CENTERED_CLASS_NAME}>
                    <strong>{t(T_LOGIN_FORM_ERROR_TITLE)}</strong>{" "}
                    {t(T_LOGIN_FORM_ERROR_CONTENT)}
                </p>
            ) : null}
        </div>
    );
}
