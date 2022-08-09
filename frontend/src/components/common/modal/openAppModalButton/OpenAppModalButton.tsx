// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useAppCallback } from "../../../../hooks/modal/useAppCallback";
import { AppModalType } from "../../../../types/AppModalType";
import { ButtonStyle } from "../../../../fi/hg/frontend/components/button/types/ButtonStyle";
import { Button } from "../../../../fi/hg/frontend/components/button/Button";
import { OPEN_APP_MODAL_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { ReactNode } from "react";
import "./OpenAppModalButton.scss";

export interface OpenAppModalButtonProps {
    readonly className ?: string;
    readonly modal ?: AppModalType | undefined;
    readonly id ?: string | undefined;
    readonly children ?: ReactNode;
}

export function OpenAppModalButton (props: OpenAppModalButtonProps) {
    const className = props?.className;
    const modal = props?.modal;
    const id = props?.id;
    const openAddUserModalCallback = useAppCallback(modal, id);
    return (
        <Button
            className={
                OPEN_APP_MODAL_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
            click={openAddUserModalCallback}
            style={ButtonStyle.LINK}>{props?.children}</Button>
    );
}