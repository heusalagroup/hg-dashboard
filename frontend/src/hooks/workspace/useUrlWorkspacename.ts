// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {useCallback, useEffect, useState} from "react";
import {WorkspaceService} from "../../services/WorkspaceService";
import {Workspace} from "../../fi/hg/dashboard/types/Workspace";
import {VoidCallback} from "../../fi/hg/core/interfaces/callbacks";
import {LogService} from "../../fi/hg/core/LogService";

const LOG = LogService.createLogger('useUrlWorkspaceName');

export function useUrlWorkspaceName (
    workspaceByUrl ?: string
):  [Workspace | undefined, VoidCallback ] {

    const [ workspace, setWorkspace ] = useState<Workspace | undefined>();

    const urlWorkspaceCallback = useCallback(
        async () => {
            try {

                const workspaceList = await WorkspaceService.getMyWorkspaceList();
                const workspace = workspaceList?.filter(listItem => listItem.id === workspaceByUrl)

                setWorkspace(workspace[0])

                await WorkspaceService.setCurrentWorkspace(workspace[0]);
                LOG.info("Set current workspace: ", workspaceByUrl )

            } catch (err) {
                LOG.debug(`Failed to load workspace list: `, err);
            }
        },
        [
            workspaceByUrl
        ]
    );

    // Update list initially
    useEffect(
        () => {

            if (workspaceByUrl !== undefined && workspace?.id === undefined){
                urlWorkspaceCallback().then(
                    ()=>{
                        LOG.debug("Workspace DONE")}
                );
            }
        },
        [
            urlWorkspaceCallback, workspaceByUrl, workspace?.id
        ]
    );

    return [ workspace, urlWorkspaceCallback ];

}
