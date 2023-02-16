// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { CLOSE_APP_MODAL_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { Button } from "../../../../fi/hg/frontend/components/button/Button";
import { ButtonStyle } from "../../../../fi/hg/core/frontend/button/ButtonStyle";
import {useAppNavigateCallback} from "../../../../hooks/modal/useAppNavigateCallback";
import "./CloseAppModalButton.scss";

export interface CloseAppModalButtonProps {
    readonly className ?: string;
}

export function CloseAppModalButton (props: CloseAppModalButtonProps) {
    const className = props?.className;
    const closeModalCallback = useAppNavigateCallback();
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
