// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { WorkspaceService } from "../../services/WorkspaceService";
import { useEventCurrentWorkspaceChanged } from "./useEventCurrentWorkspaceChanged";

export function useCurrentWorkspaceId (): string | undefined {
    const [ workspaceId, setWorkspaceId ] = useState<string | undefined>(
        () => WorkspaceService.getCurrentWorkspaceId()
    );
    const onEvent = useCallback(
        () => {
            setWorkspaceId(() => WorkspaceService.getCurrentWorkspaceId());
        },
        [
            setWorkspaceId
        ]
    );
    useEventCurrentWorkspaceChanged(onEvent);
    return workspaceId;
}
