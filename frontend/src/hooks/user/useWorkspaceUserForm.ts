// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useEffect, useState } from "react";
import { LogService } from "../../fi/hg/core/LogService";
import { UserService } from "../../services/UserService";
import { createUser, User } from "../../fi/hg/dashboard/types/User";

const LOG = LogService.createLogger('useWorkspaceUserForm');

export function useWorkspaceUserForm (
    workspaceId        ?: string,
    partialInitialUser ?: Partial<User>
) {

    const [ user, setUser ] = useState<User>(() => {
        const initialState = {
            ...createUser(
                workspaceId ?? '',
                'new',
                '',
                ''
            ),
            ...(partialInitialUser ?? {})
        };
        LOG.debug(`Initialized as: `, initialState);
        return initialState;
    });

    const partialSetUser = useCallback(
        (changes: Partial<User>) => {
            setUser((oldModel: User) => {
                const newModel: User = {
                    ...oldModel,
                    ...changes
                };
                LOG.debug(`Changing model as: `, newModel);
                return newModel;
            });
        },
        [
            setUser
        ]
    );

    const submitCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Saving user: `, user);
                const savedUser = await UserService.saveWorkspaceUser(workspaceId ?? '', user);
                LOG.info(`Saved user as `, savedUser);
            } catch (err) {
                LOG.error(`Could not save user: `, user, err);
            }
        },
        [
            workspaceId,
            user
        ]
    );

    const onChangedEvent = useCallback(
        () => {
            setUser(
                (oldState: User) => {
                    const item: User = {
                        ...oldState,
                        workspaceId: workspaceId ?? ''
                    };
                    LOG.debug(`Workspace change changed user model as: `, item);
                    return item;
                }
            );
        },
        [
            setUser,
            workspaceId
        ]
    );

    useEffect(
        onChangedEvent,
        [
            workspaceId,
            onChangedEvent
        ]
    );

    return {
        user,
        setUser: partialSetUser,
        submitCallback
    };

}
