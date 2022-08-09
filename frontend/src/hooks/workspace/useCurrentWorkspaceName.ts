// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { WorkspaceService } from "../../services/WorkspaceService";
import { useEventCurrentWorkspaceChanged } from "./useEventCurrentWorkspaceChanged";

export function useCurrentWorkspaceName (): string | undefined {
    const [ workspaceName, setWorkspaceName ] = useState<string | undefined>(
        () => WorkspaceService.getCurrentWorkspaceName()
    );
    const onEvent = useCallback(
        () => {
            setWorkspaceName(() => WorkspaceService.getCurrentWorkspaceName());
        },
        [
            setWorkspaceName
        ]
    );
    useEventCurrentWorkspaceChanged(onEvent);
    return workspaceName;
}
