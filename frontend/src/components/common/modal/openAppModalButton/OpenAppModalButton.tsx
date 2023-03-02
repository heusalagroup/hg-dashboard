// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { AppModalType } from "../../../../types/AppModalType";
import { ButtonStyle } from "../../../../fi/hg/core/frontend/button/ButtonStyle";
import { Button } from "../../../../fi/hg/frontend/components/button/Button";
import { OPEN_APP_MODAL_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { ReactNode } from "react";
import {useAppWithRouteCallback} from "../../../../hooks/modal/useAppWithRouteCallback";
import "./OpenAppModalButton.scss";

export interface OpenAppModalButtonProps {
    readonly className ?: string;
    readonly modal ?: AppModalType | undefined;
    readonly id ?: string | undefined;
    readonly parentId ?: string | undefined;
    readonly children ?: ReactNode;
    readonly style ?: ButtonStyle;
}

export function OpenAppModalButton (props: OpenAppModalButtonProps) {
    const className = props?.className;
    const modal = props?.modal;
    const id = props?.id;
    const parentId = props?.parentId;
    const style = props?.style ?? ButtonStyle.LINK;
    const openAddUserModalCallback = useAppWithRouteCallback(modal, parentId, id);
    return (
        <Button
            className={
                OPEN_APP_MODAL_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
            click={openAddUserModalCallback}
            style={style}>{props?.children}</Button>
    );
}
