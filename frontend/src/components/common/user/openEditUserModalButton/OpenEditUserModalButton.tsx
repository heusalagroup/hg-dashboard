// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { OpenAppModalButton } from "../../modal/openAppModalButton/OpenAppModalButton";
import { AppModalType } from "../../../../types/AppModalType";
import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { EditIcon } from "../../../../assets/icons";
import { ButtonStyle } from "../../../../fi/hg/core/frontend/button/ButtonStyle";

export interface OpenEditUserModalButtonProps {
    readonly id : string;
    readonly style ?: ButtonStyle;
}

export function OpenEditUserModalButton (
    props: OpenEditUserModalButtonProps
) {
    const id = props?.id;
    const style = props?.style ?? ButtonStyle.LINK;
    return (
        <OpenAppModalButton
            modal={AppModalType.EDIT_USER_MODAL}
            id={id}
            style={style}
        ><Icon><EditIcon /></Icon></OpenAppModalButton>
    );
}
