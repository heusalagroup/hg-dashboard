// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ModalState } from "../../views/types/ModelState";
import { EmailTokenDTO } from "../../../fi/hg/core/auth/email/types/EmailTokenDTO";
import { EmailUtils } from "../../../fi/hg/core/EmailUtils";
import { EmailAuthSessionService } from "../../../fi/hg/frontend/services/EmailAuthSessionService";
import { useState, useEffect, MouseEvent, useCallback } from "react";
import { Loader } from "../../../fi/hg/frontend/components/loader/Loader";
import { LogService } from "../../../fi/hg/core/LogService";
import {
    FORM_CLASS_NAME,
    LOGIN_FORM_CLASS_NAME,
    TEXT_CENTERED_CLASS_NAME
} from "../../../constants/appClassName";
import {
    T_LOGIN_FORM_EMAIL_FIELD_PLACEHOLDER,
    T_LOGIN_FORM_ERROR_CONTENT,
    T_LOGIN_FORM_ERROR_TITLE,
    T_LOGIN_FORM_SUBMIT_BUTTON_LABEL,
    T_LOGIN_FORM_THANK_YOU_CONTENT,
    T_LOGIN_FORM_THANK_YOU_TITLE,
    T_LOGIN_FORM_VERIFICATION_CODE_FIELD_LABEL,
} from "../../../constants/translation";
import { TFunction } from "i18next";
import { useEventSessionTokenUpdated } from "../../../hooks/session/useEventSessionTokenUpdated";
import { Form } from "../../../fi/hg/frontend/components/form/Form";
import { EmailField } from "../../../fi/hg/frontend/components/fields/email/EmailField";
import { TextField } from "../../../fi/hg/frontend/components/fields/text/TextField";
import { Button } from "../../../fi/hg/frontend/components/button/Button";
import { ButtonType } from "../../../fi/hg/core/frontend/button/ButtonType";
import './LoginForm.scss';

const LOG = LogService.createLogger("LoginForm");

export interface LoginFormProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function LoginForm (props: LoginFormProps) {

    const t = props?.t;
    const className = props?.className;
    const [ authenticatedEmailToken, setAuthenticatedEmailToken ] = useState<EmailTokenDTO | undefined>(EmailAuthSessionService.getEmailToken());
    const [ modalState, setModalState ] = useState<ModalState>(authenticatedEmailToken ? ModalState.AUTHENTICATED : ModalState.UNAUTHENTICATED);
    const [ isError, setError ] = useState<boolean>(false);
    const [ code, setCode ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ orderEmailToken, setOrderEmailToken ] = useState<EmailTokenDTO | undefined>(undefined);
    const [ isButtonEnabled, setButtonEnabled ] = useState<boolean>(false);

    const sessionTokenUpdatedCallback = useCallback(
        () => {
            const token = EmailAuthSessionService.getEmailToken();
            setAuthenticatedEmailToken(token);
            if ( token && modalState !== ModalState.AUTHENTICATED ) {
                setModalState(ModalState.AUTHENTICATED);
            } else if ( modalState !== ModalState.UNAUTHENTICATED ) {
                setModalState(ModalState.UNAUTHENTICATED);
            }
        },
        [
            modalState,
            setModalState
        ]
    );

    useEventSessionTokenUpdated(sessionTokenUpdatedCallback);

    const voidCallback = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if ( event ) {
                event.stopPropagation();
                event.preventDefault();
            }
        },
        []
    );

    const onCodeFieldChangeCallback = useCallback(
        (
            value: string | undefined
        ) => {
            setCode(value ?? '');
        },
        [
            setCode
        ]
    );

    const onEmailFieldChangeCallback = useCallback(
        (
            value: string | undefined
        ) => {
            setEmail(value ?? '');
            setButtonEnabled(EmailUtils.isEmailValid(value ?? ''));
        },
        [
            setEmail,
            setButtonEnabled
        ]
    );

    const submitCode = useCallback(
        (code: string) => {

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
        },
        [
            orderEmailToken,
            setModalState,
            setError
        ]
    );

    const submitCodeForm = useCallback(
        () => {
            submitCode(code);
        },
        [
            submitCode,
            code
        ]
    );

    const submitCodeButtonClick = useCallback(
        () => {
            submitCode(code);
        },
        [
            submitCode,
            code
        ]
    );

    const submitEmail = useCallback(
        (emailAddress: string) => {
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
        },
        [
            setModalState,
            setOrderEmailToken,
            setError
        ]
    );

    const submitEmailButtonClick = useCallback(
        () => {
            submitEmail(email);
        },
        [
            submitEmail,
            email
        ]
    );

    const submitEmailForm = useCallback(
        () => {
            submitEmail(email);
        },
        [
            submitEmail,
            email
        ]
    );

    useEffect(
        () => {
            setButtonEnabled(isButtonEnabled);
        },
        [
            setButtonEnabled,
            isButtonEnabled
        ]
    );

    return (
        <div
            className={
                LOGIN_FORM_CLASS_NAME +
                " " +
                FORM_CLASS_NAME +
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
                        LOGIN_FORM_CLASS_NAME + "-container hg-form-container"
                    }
                >
                    <Form
                        submit={
                            modalState === ModalState.AUTHENTICATING
                                ? submitCodeForm
                                : submitEmailForm
                        }
                    >
                        {modalState === ModalState.UNAUTHENTICATED ? (
                            <EmailField
                                value={email}
                                change={onEmailFieldChangeCallback}
                                placeholder={t(T_LOGIN_FORM_EMAIL_FIELD_PLACEHOLDER)}
                            />
                        ) : null}

                        {modalState === ModalState.AUTHENTICATING ? (
                            <TextField
                                value={code}
                                change={onCodeFieldChangeCallback}
                                placeholder={t(T_LOGIN_FORM_VERIFICATION_CODE_FIELD_LABEL)}
                            />
                        ) : null}

                        <Button
                            type={ButtonType.SUBMIT}
                            enabled={ isButtonEnabled }
                            click={
                                modalState === ModalState.AUTHENTICATING
                                ? submitCodeButtonClick
                                : submitEmailButtonClick
                            }
                        >{t(T_LOGIN_FORM_SUBMIT_BUTTON_LABEL)}</Button>

                    </Form>
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
