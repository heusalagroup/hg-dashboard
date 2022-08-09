// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { UserService } from "../../services/UserService";
import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../fi/hg/core/LogService";
import { VoidCallback } from "../../fi/hg/core/interfaces/callbacks";
import { User } from "../../fi/hg/dashboard/types/User";

const LOG = LogService.createLogger('useWorkspaceUser');

export function useWorkspaceUser (
    workspaceId ?: string,
    userId      ?: string
) : [User|undefined, VoidCallback] {

    const [ item, setItem ] = useState<User|undefined>(undefined);

    const reloadCallback = useCallback(
        () => {
            if (workspaceId && userId) {
                UserService.getWorkspaceUser(workspaceId, userId).then((result) => {
                    setItem(result);
                }).catch((err) => {
                    LOG.error(`useUser: Failed to load user "${userId}" for workspace "${workspaceId}": `, err);
                });
            } else {
                LOG.debug(`useWorkspaceUser: Did not have workspaceId and/or userId`);
            }
        },
        [
            setItem,
            workspaceId,
            userId,
            workspaceId
        ]
    );

    useEffect(
        () => {
            reloadCallback();
        },
        [
            reloadCallback
        ]
    );

    return [ item, reloadCallback ];

}
