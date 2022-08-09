// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { OpenAppModalButton } from "../../modal/openAppModalButton/OpenAppModalButton";
import { AppModalType } from "../../../../types/AppModalType";
import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { EditIcon } from "../../../../assets/icons";

export interface OpenEditUserModalButtonProps {
    readonly id : string;
}

export function OpenEditUserModalButton (
    props: OpenEditUserModalButtonProps
) {
    const id = props?.id;
    return (
        <OpenAppModalButton
            modal={AppModalType.EDIT_USER_MODAL}
            id={id}
        ><Icon><EditIcon /></Icon></OpenAppModalButton>
    );
}
