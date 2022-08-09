// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WorkspaceService } from "../../services/WorkspaceService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../fi/hg/core/LogService";
import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { WORKSPACE_LIST_DEBOUNCE_MS } from "../../constants/frontend";
import { useDebounceCallback } from "../../fi/hg/frontend/hooks/useDebounceCallback";
import { Workspace } from "../../fi/hg/dashboard/types/Workspace";

const LOG = LogService.createLogger('useWorkspaceList');

export function useWorkspaceList (): [ readonly Workspace[] | undefined, VoidCallback ] {

    const [ list, setList ] = useState<readonly Workspace[] | undefined >(undefined);

    const debouncedCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Fetching list`);
                const result = await WorkspaceService.getMyWorkspaceList();
                LOG.debug(`Received list: `, result);
                setList(result);
            } catch (err) {
                LOG.error(`Failed to load workspace list: `, err);
            }
        },
        [
            setList
        ]
    );

    const delayedReloadCallback = useDebounceCallback(
        debouncedCallback,
        WORKSPACE_LIST_DEBOUNCE_MS
    );

    // Update list initially
    useEffect(
        () => {
            LOG.debug(`Initial update triggered`);
            delayedReloadCallback();
        },
        [
            delayedReloadCallback
        ]
    );

    return [ list, delayedReloadCallback ];

}
