// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";
import { SessionService, SessionServiceEvent } from "../../services/SessionService";

/**
 *
 * @param callback If callback has dependencies, you should wrap it inside useCallback!
 */
export function useEventSessionProfileUpdated (
    callback: VoidCallback
) {
    return useServiceEvent<SessionServiceEvent>(
        SessionService,
        SessionServiceEvent.PROFILE_UPDATED,
        callback
    );
}
