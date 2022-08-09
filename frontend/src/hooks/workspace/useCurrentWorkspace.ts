// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { WorkspaceService } from "../../services/WorkspaceService";
import { useEventCurrentWorkspaceChanged } from "./useEventCurrentWorkspaceChanged";
import { Workspace } from "../../fi/hg/dashboard/types/Workspace";

export function useCurrentWorkspace (): Workspace | undefined {
    const [ workspace, setWorkspace ] = useState<Workspace | undefined>(
        () => WorkspaceService.getCurrentWorkspace()
    );
    const onEvent = useCallback(
        () => {
            setWorkspace(() => WorkspaceService.getCurrentWorkspace());
        },
        [
            setWorkspace
        ]
    );
    useEventCurrentWorkspaceChanged(onEvent);
    return workspace;
}
