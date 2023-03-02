// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EDIT_USER_MODAL_CLASS_NAME } from "../../../../constants/appClassName";
import { CloseAppModalButton } from "../../../common/modal/closeAppModalButton/CloseAppModalButton";
import { T_EDIT_USER_MODAL_TITLE } from "../../../../constants/translation";
import { UserForm } from "../../../forms/userForm/UserForm";
import { LogService } from "../../../../fi/hg/core/LogService";
import { useEventUserUpdated } from "../../../../hooks/user/useEventUserUpdated";
import { useWorkspaceUser } from "../../../../hooks/user/useWorkspaceUser";
import { Loader } from "../../../../fi/hg/frontend/components/loader/Loader";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import { useCurrentWorkspaceId } from "../../../../hooks/workspace/useCurrentWorkspaceId";
import { useAppModalCurrentId } from "../../../../hooks/modal/useAppModalCurrentId";
import {useAppNavigateCallback} from "../../../../hooks/modal/useAppNavigateCallback";
import "./EditUserModal.scss";

const LOG = LogService.createLogger('EditUserModal');

export interface NewUserFormProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function EditUserModal (props: NewUserFormProps) {
    const t = props?.t;
    const className = props?.className;
    const closeModalCallback = useAppNavigateCallback();
    const workspaceId = useCurrentWorkspaceId();
    const appModalId = useAppModalCurrentId();
    const [user] = useWorkspaceUser(workspaceId, appModalId );

    useEventUserUpdated(() => {
        LOG.debug(`Closing edit user modal`);
        closeModalCallback();
    });

    if (!workspaceId) {
        return <Loader />;
    }

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
                    <UserForm t={t} user={user} workspaceId={workspaceId} />
                )}
            </article>

        </div>
    );
}
