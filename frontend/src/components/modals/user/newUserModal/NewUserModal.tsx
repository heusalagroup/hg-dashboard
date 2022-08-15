// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NEW_USER_MODAL_CLASS_NAME } from "../../../../constants/appClassName";
import { CloseAppModalButton } from "../../../common/modal/closeAppModalButton/CloseAppModalButton";
import { T_NEW_USER_MODAL_TITLE } from "../../../../constants/translation";
import { UserForm } from "../../../forms/userForm/UserForm";
import { useEventUserAdded } from "../../../../hooks/user/useEventUserAdded";
import { useAppCallback } from "../../../../hooks/modal/useAppCallback";
import { LogService } from "../../../../fi/hg/core/LogService";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import { Loader } from "../../../../fi/hg/frontend/components/loader/Loader";
import "./NewUserModal.scss";
import { useCurrentWorkspaceId } from "../../../../hooks/workspace/useCurrentWorkspaceId";

const LOG = LogService.createLogger('NewUserModal');

export interface NewUserFormProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function NewUserModal (props: NewUserFormProps) {

    const t = props?.t;
    const className = props?.className;
    const closeModalCallback = useAppCallback();
    const workspaceId = useCurrentWorkspaceId();

    useEventUserAdded(() => {
        LOG.debug(`Closing new user modal`);
        closeModalCallback();
    });

    if (!workspaceId) {
        return <Loader />;
    }

    return (
        <div
            className={
                NEW_USER_MODAL_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >
            <header className={NEW_USER_MODAL_CLASS_NAME + '-header'}>
                <h3 className={NEW_USER_MODAL_CLASS_NAME + '-header-title'}>{t(T_NEW_USER_MODAL_TITLE)}</h3>
                <CloseAppModalButton className={NEW_USER_MODAL_CLASS_NAME + '-header-close-button'} />
            </header>

            <article className={NEW_USER_MODAL_CLASS_NAME + '-content'}>
                <UserForm t={t} workspaceId={workspaceId} />
            </article>

        </div>
    );
}
