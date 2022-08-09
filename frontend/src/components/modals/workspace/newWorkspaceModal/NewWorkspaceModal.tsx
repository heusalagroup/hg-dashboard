// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NEW_WORKSPACE_MODAL_CLASS_NAME } from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import { CloseAppModalButton } from "../../../common/modal/closeAppModalButton/CloseAppModalButton";
import { T_NEW_WORKSPACE_MODAL_TITLE } from "../../../../constants/translation";
import { WorkspaceForm } from "../../../forms/workspaceForm/WorkspaceForm";
import { useEventWorkspaceAdded } from "../../../../hooks/workspace/useEventWorkspaceAdded";
import { useAppCallback } from "../../../../hooks/modal/useAppCallback";
import { LogService } from "../../../../fi/hg/core/LogService";
import "./NewWorkspaceModal.scss";

const LOG = LogService.createLogger('NewWorkspaceModal');

export interface NewWorkspaceFormProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function NewWorkspaceModal (props: NewWorkspaceFormProps) {
    const t = props?.t;
    const className = props?.className;
    const closeModalCallback = useAppCallback();
    useEventWorkspaceAdded(() => {
        LOG.debug(`Closing new workspace modal`);
        closeModalCallback();
    });
    return (
        <div
            className={
                NEW_WORKSPACE_MODAL_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >
            <header className={NEW_WORKSPACE_MODAL_CLASS_NAME + '-header'}>
                <h3 className={NEW_WORKSPACE_MODAL_CLASS_NAME + '-header-title'}>{t(T_NEW_WORKSPACE_MODAL_TITLE)}</h3>
                <CloseAppModalButton className={NEW_WORKSPACE_MODAL_CLASS_NAME + '-header-close-button'} />
            </header>

            <article className={NEW_WORKSPACE_MODAL_CLASS_NAME + '-content'}>
                <WorkspaceForm t={t} />
            </article>
        </div>
    );
}
