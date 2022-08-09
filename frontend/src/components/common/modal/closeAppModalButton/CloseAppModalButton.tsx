// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { CLOSE_APP_MODAL_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { Button } from "../../../../fi/hg/frontend/components/button/Button";
import { ButtonStyle } from "../../../../fi/hg/frontend/components/button/types/ButtonStyle";
import { useAppCallback } from "../../../../hooks/modal/useAppCallback";
import "./CloseAppModalButton.scss";

export interface CloseAppModalButtonProps {
    readonly className ?: string;
}

export function CloseAppModalButton (props: CloseAppModalButtonProps) {
    const className = props?.className;
    const closeModalCallback = useAppCallback();
    return (
        <Button
            className={
                CLOSE_APP_MODAL_BUTTON_CLASS_NAME
                + (className? ` ${className}` : '')
            }
            click={closeModalCallback}
            style={ButtonStyle.LINK}>
            &#x2715;
        </Button>
    );
}
