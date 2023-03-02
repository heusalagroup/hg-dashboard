// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

/**
 * If user has url link... this
 * find user's workspaces and check if urls workspace is there
 * set current workspace
 * set route
 * open modal
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
):VoidCallback {

return useCallback(
        async () => {
            try {

                const workspaceList = await WorkspaceService.getMyWorkspaceList();
                const workspace = workspaceList?.find(listItem => listItem.id === workspaceByUrl)

                LOG.info("Set current workspace: ", workspace )

                const modal = AppModalService.getCurrentModal();

                if(modal !== AppModalType.EDIT_USER_MODAL) {

                    await WorkspaceService.setCurrentWorkspace(workspace).then(() => {
                        LOG.info("Current workspace has set: ", workspace?.name)
                        RouteService.setRoute('/workspace/' + workspace?.id + '/users/' + userByUrl);

                        LOG.info("Just opening new modal ... ")
                        AppModalService.setCurrentModal(AppModalType.EDIT_USER_MODAL, userByUrl);

                        return;
                    });
                }


            } catch (err) {
                LOG.debug(`Failed to load workspace list: `, err);
            }
        },
        [
            workspaceByUrl, userByUrl
        ]
    );

}
