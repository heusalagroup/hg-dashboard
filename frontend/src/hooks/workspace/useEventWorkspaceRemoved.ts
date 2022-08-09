// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WorkspaceService, WorkspaceServiceEvent } from "../../services/WorkspaceService";
import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";

/**
 *
 * @param callback If callback has dependencies, you should wrap it inside useCallback!
 */
export function useEventWorkspaceRemoved (
    callback: VoidCallback
) {
    return useServiceEvent<WorkspaceServiceEvent>(
        WorkspaceService,
        WorkspaceServiceEvent.WORKSPACE_REMOVED,
        callback
    );
}
