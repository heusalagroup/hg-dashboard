// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { OpenAppModalButton } from "../../modal/openAppModalButton/OpenAppModalButton";
import { AppModalType } from "../../../../types/AppModalType";
import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { AddIcon } from "../../../../assets/icons";

export interface OpenNewWorkspaceModalButtonProps {
}

export function OpenNewWorkspaceModalButton (props: OpenNewWorkspaceModalButtonProps) {
    return (
        <OpenAppModalButton
            modal={AppModalType.NEW_WORKSPACE_MODAL}
        ><Icon><AddIcon /></Icon></OpenAppModalButton>
    );
}
