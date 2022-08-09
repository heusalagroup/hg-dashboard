// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useEffect, useState } from "react";
import { SessionService } from "../../services/SessionService";
import { LogService } from "../../fi/hg/core/LogService";
import { Profile } from "../../fi/hg/dashboard/types/Profile";

const LOG = LogService.createLogger('useSession');

export function useSession () : [ Profile | undefined, boolean | undefined] {

    const [ isLoggedIn, setIsLoggedIn ] = useState<boolean | undefined>(SessionService.isLoggedIn());
    const [ profile, setProfile ] = useState<Profile | undefined>(() => SessionService.getProfile());

    useEffect(
        () => {
            return SessionService.on(
                SessionService.Event.PROFILE_UPDATED,
                () => {
                    LOG.debug("useSession: Profile updated: ", SessionService.isLoggedIn(), SessionService.getProfile());
                    setIsLoggedIn(() => SessionService.isLoggedIn());
                    setProfile(() => SessionService.getProfile());
                }
            );
        },
        [
        ]
    );

    return [profile, isLoggedIn];
}
