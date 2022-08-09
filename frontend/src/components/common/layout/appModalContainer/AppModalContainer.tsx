// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { APP_MODAL_CONTAINER_CLASS_NAME } from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import { AppModalType } from "../../../../types/AppModalType";
import { NewUserModal } from "../../../modals/user/newUserModal/NewUserModal";
import { LogService } from "../../../../fi/hg/core/LogService";
import { EditUserModal } from "../../../modals/user/editUserModal/EditUserModal";
import { NewSupplierModal } from "../../../modals/supplier/newSupplierModal/NewSupplierModal";
import { EditSupplierModal } from "../../../modals/supplier/editSupplierModal/EditSupplierModal";
import "./AppModalContainer.scss";
import { NewTicketModal } from "../../../modals/ticket/newTicketModal/NewTicketModal";
import { EditTicketModal } from "../../../modals/ticket/editTicketModal/EditTicketModal";
import { NewWorkspaceModal } from "../../../modals/workspace/newWorkspaceModal/NewWorkspaceModal";

const LOG = LogService.createLogger('AppModalContainer');

export interface AppModalContainerProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly modal?: AppModalType | undefined;
}

export function AppModalContainer (props: AppModalContainerProps) {
    const t = props?.t;
    const className = props?.className;
    const modal = props?.modal;
    LOG.debug(`modal: `, modal);
    return (
        <div
            className={
                APP_MODAL_CONTAINER_CLASS_NAME
                + (className ? ` ${className}` : '')
                + ' ' + APP_MODAL_CONTAINER_CLASS_NAME + (modal ? '-visible' : '-hidden')
            }
        >

            {modal === AppModalType.NEW_WORKSPACE_MODAL ? (
                <NewWorkspaceModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.NEW_TICKET_MODAL ? (
                <NewTicketModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.EDIT_TICKET_MODAL ? (
                <EditTicketModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.NEW_USER_MODAL ? (
                <NewUserModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.EDIT_USER_MODAL ? (
                <EditUserModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.NEW_SUPPLIER_MODAL ? (
                <NewSupplierModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

            {modal === AppModalType.EDIT_SUPPLIER_MODAL ? (
                <EditSupplierModal t={t} className={APP_MODAL_CONTAINER_CLASS_NAME+'-modal'} />
            ) : null}

        </div>
    );

}
