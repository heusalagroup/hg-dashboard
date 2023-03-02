// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

/**
 * If user has url link... this
 * find user's workspaces and check if urls workspace is there
 * set current workspace
 * set route
 * open modal
 * and return it
 * */
import {useCallback, useEffect, useState} from "react";
import {WorkspaceService} from "../../services/WorkspaceService";
import {Workspace} from "../../fi/hg/dashboard/types/Workspace";
import {VoidCallback} from "../../fi/hg/core/interfaces/callbacks";
import {LogService} from "../../fi/hg/core/LogService";
import {RouteService} from "../../fi/hg/frontend/services/RouteService";
import {AppModalService} from "../../services/AppModalService";
import {AppModalType} from "../../types/AppModalType";

const LOG = LogService.createLogger('useUrlWorkspaceName');

export function useUrlWorkspaceName (
    workspaceByUrl ?: string,
    userByUrl ?: string
):  [Workspace | undefined, VoidCallback ] {

    const [ workspace, setWorkspace ] = useState<Workspace | undefined>();

    const urlWorkspaceCallback = useCallback(
        async () => {
            try {

                const workspaceList = await WorkspaceService.getMyWorkspaceList();
                const workspace = workspaceList?.find(listItem => listItem.id === workspaceByUrl)

                LOG.info("Set current workspace: ", workspace )
                setWorkspace(workspace)

               await WorkspaceService.setCurrentWorkspace(workspace).then(()=> {
                    LOG.info("Current workspace has set: ", workspace?.name )
                    RouteService.setRoute('/workspace/'+ workspace?.id +'/users/'+ userByUrl);
                    AppModalService.setCurrentModal(AppModalType.EDIT_USER_MODAL, userByUrl);
                   return;
                });


            } catch (err) {
                LOG.debug(`Failed to load workspace list: `, err);
            }
        },
        [
            workspaceByUrl
        ]
    );

    //Update initially
    useEffect(
        () => {
            if (workspaceByUrl !== undefined && workspace?.id === undefined && userByUrl !== undefined) {
                urlWorkspaceCallback().then(
                    () => {
                        LOG.info("Workspace DONE")
                        return;
                    }
                );
            }
        },
        [
            urlWorkspaceCallback, workspaceByUrl, workspace?.id
        ]
    );
    return [ workspace, urlWorkspaceCallback ];
}
