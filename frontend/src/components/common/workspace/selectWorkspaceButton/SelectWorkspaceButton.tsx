// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { SignInIcon } from "../../../../assets/icons";
import { Button } from "../../../../fi/hg/frontend/components/button/Button";
import { ReactNode, useCallback } from "react";
import { WorkspaceService } from "../../../../services/WorkspaceService";
import { Workspace } from "../../../../fi/hg/dashboard/types/Workspace";
import { ButtonStyle } from "../../../../fi/hg/core/frontend/button/ButtonStyle";
import {RouteService} from "../../../../fi/hg/frontend/services/RouteService";

export interface SelectWorkspaceButtonProps {
    readonly className?: string;
    readonly workspace: Workspace;
    readonly children ?: ReactNode;
}

export function SelectWorkspaceButton (props: SelectWorkspaceButtonProps) {
    const className = props?.className;
    const workspace = props?.workspace;
    const children = props?.children;
    const onClick = useCallback(
        () => {
            WorkspaceService.setCurrentWorkspace(workspace).then(()=>{
                RouteService.setRoute("/workspace/"+workspace?.id+"/about")
            });
        },
        [
            workspace
        ]
    );
    return (
        <Button
            style={ButtonStyle.INFO}
            className={
                className ? className : ''
            }
            click={onClick}
        ><Icon><SignInIcon /></Icon>{children}</Button>
    );
}
