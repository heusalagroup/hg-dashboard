// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { LogService } from "../../fi/hg/core/LogService";
import { WorkspaceService } from "../../services/WorkspaceService";
import { createWorkspace, Workspace } from "../../fi/hg/dashboard/types/Workspace";

const LOG = LogService.createLogger('useWorkspaceForm');

export function useWorkspaceForm (
    partialInitialWorkspace ?: Partial<Workspace>
) {

    const [ workspace, setWorkspace ] = useState<Workspace>(() => {
        const initialState = {
            ...createWorkspace(
                'new',
                ''
            ),
            ...(partialInitialWorkspace ?? {})
        };
        LOG.debug(`Initialized as: `, initialState);
        return initialState;
    });

    const partialSetWorkspace = useCallback(
        (changes: Partial<Workspace>) => {
            setWorkspace((oldModel: Workspace) => {
                const newModel : Workspace = {
                    ...oldModel,
                    ...changes
                };
                LOG.debug(`Changing model as: `, newModel);
                return newModel;
            });
        },
        [
            setWorkspace
        ]
    );

    const submitCallback = useCallback(
        async () => {
            try {
                LOG.debug(`Saving workspace: `, workspace);
                const savedWorkspace = await WorkspaceService.saveWorkspace(workspace);
                LOG.info(`Saved workspace as `, savedWorkspace);
            } catch (err) {
                LOG.error(`Could not save workspace: `, workspace, err);
            }
        },
        [
            workspace
        ]
    );

    return {
        workspace,
        setWorkspace: partialSetWorkspace,
        submitCallback
    };

}
