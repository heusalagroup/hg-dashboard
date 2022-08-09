// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { UserService } from "../../services/UserService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../fi/hg/core/LogService";
import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { useDebounceCallback } from "../../fi/hg/frontend/hooks/useDebounceCallback";
import { USER_LIST_DEBOUNCE_MS } from "../../constants/frontend";
import { User } from "../../fi/hg/dashboard/types/User";

const LOG = LogService.createLogger('useUserList');

/**
 * This hook does not listen change events! Use event listener hooks to trigger
 * the returned refresh callback if you want to change the list.
 *
 * @param workspaceId
 */
export function useWorkspaceUserList (
    workspaceId : string | undefined
): [ readonly User[] | undefined, VoidCallback ] {

    const [ list, setList ] = useState<readonly User[] | undefined>(undefined);

    const debounceCallback = useCallback(
        async () => {
            try {
                if (workspaceId) {
                    LOG.debug(`Fetching user list for "${workspaceId}"`);
                    const result = await UserService.getWorkspaceUserList(workspaceId);
                    LOG.debug(`Received list: `, result);
                    setList(result);
                } else {
                    LOG.debug(`No workspace id yet`);
                }
            } catch (err) {
                LOG.error(`Failed to load user list: `, err);
            }
        },
        [
            workspaceId
        ]
    );

    const delayedReloadCallback = useDebounceCallback(
        debounceCallback,
        USER_LIST_DEBOUNCE_MS
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
