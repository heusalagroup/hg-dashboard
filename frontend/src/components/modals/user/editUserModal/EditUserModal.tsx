// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EDIT_USER_MODAL_CLASS_NAME } from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import { CloseAppModalButton } from "../../../common/modal/closeAppModalButton/CloseAppModalButton";
import { T_EDIT_USER_MODAL_TITLE } from "../../../../constants/translation";
import { UserForm } from "../../../forms/userForm/UserForm";
import { useAppCallback } from "../../../../hooks/modal/useAppCallback";
import { LogService } from "../../../../fi/hg/core/LogService";
import { useEventUserUpdated } from "../../../../hooks/user/useEventUserUpdated";
import { useWorkspaceUser } from "../../../../hooks/user/useWorkspaceUser";
import { Loader } from "../../../../fi/hg/frontend/components/loader/Loader";
import { AppModalService } from "../../../../services/AppModalService";
import "./EditUserModal.scss";

const LOG = LogService.createLogger('EditUserModal');

export interface NewUserFormProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function EditUserModal (props: NewUserFormProps) {
    const t = props?.t;
    const className = props?.className;
    const closeModalCallback = useAppCallback();
    useEventUserUpdated(() => {
        LOG.debug(`Closing edit user modal`);
        closeModalCallback();
    });
    const [user] = useWorkspaceUser(AppModalService.getCurrentId() );
    return (
        <div
            className={
                EDIT_USER_MODAL_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >

            <header className={EDIT_USER_MODAL_CLASS_NAME + '-header'}>
                <h3 className={EDIT_USER_MODAL_CLASS_NAME + '-header-title'}>{t(T_EDIT_USER_MODAL_TITLE)}</h3>
                <CloseAppModalButton className={EDIT_USER_MODAL_CLASS_NAME + '-header-close-button'} />
            </header>

            <article className={EDIT_USER_MODAL_CLASS_NAME + '-content'}>
                {user === undefined ? (
                    <Loader />
                ): (
                    <UserForm t={t} user={user} />
                )}
            </article>

        </div>
    );
}
