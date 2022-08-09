// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";
import { EmailAuthSessionService, EmailAuthSessionServiceEvent } from "../../fi/hg/frontend/services/EmailAuthSessionService";

/**
 *
 * @param callback If callback has dependencies, you should wrap it inside useCallback!
 */
export function useEventSessionTokenUpdated (
    callback: VoidCallback
) {
    return useServiceEvent<EmailAuthSessionServiceEvent>(
        EmailAuthSessionService,
        EmailAuthSessionServiceEvent.EMAIL_TOKEN_UPDATED,
        callback
    );
}
