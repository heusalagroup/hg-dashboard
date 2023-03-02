// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { OpenAppModalButton } from "../../modal/openAppModalButton/OpenAppModalButton";
import { AppModalType } from "../../../../types/AppModalType";
import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { EditIcon } from "../../../../assets/icons";
import { ButtonStyle } from "../../../../fi/hg/core/frontend/button/ButtonStyle";

export interface OpenEditUserModalButtonProps {
    readonly id : string;
    readonly style ?: ButtonStyle;
    readonly parentId: string;
}
export function OpenEditUserModalButton (
    props: OpenEditUserModalButtonProps
) {
    const id = props?.id;
    const parentId = props?.parentId;
    const style = props?.style ?? ButtonStyle.LINK;
    return (
        <OpenAppModalButton
            modal={AppModalType.EDIT_USER_MODAL}
            id={id}
            parentId={parentId}
            style={style}
        ><Icon><EditIcon /></Icon></OpenAppModalButton>
    );
}