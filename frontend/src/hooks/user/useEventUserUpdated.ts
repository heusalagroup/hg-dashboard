// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { UserService, UserServiceEvent } from "../../services/UserService";
import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";

/**
 *
 * @param callback If callback has dependencies, you should wrap it inside useCallback!
 */
export function useEventUserUpdated (
    callback: VoidCallback
) {
    return useServiceEvent<UserServiceEvent>(
        UserService,
        UserServiceEvent.USER_UPDATED,
        callback
    );
}
