// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode, MouseEvent } from "react";
import { VoidCallback } from "../../../fi/hg/core/interfaces/callbacks";
import { DASHBOARD_MODAL_CONTAINER_CLASS_NAME } from "../../../constants/appClassName";
import "./DashboardModalContainer.scss";

export interface DashboardModalContainerProps {
    readonly className?: string;
    readonly children?: ReactNode;
    readonly closeModal: VoidCallback;
}

export function DashboardModalContainer(props: DashboardModalContainerProps) {

    const className = props?.className;
    const closeModal = props.closeModal;

    function closeFollowModalButtonCallback(event: MouseEvent<HTMLButtonElement>) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        closeModal();
    }

    return (
        <div className={DASHBOARD_MODAL_CONTAINER_CLASS_NAME
            + (className ? ` ${className}` : '')
        } >

            <button onClick={closeFollowModalButtonCallback} className={"close-button"}>&#x2715;</button>

            {props?.children}

        </div>
    );

}
