// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { AppModalType } from "../../types/AppModalType";
import { AppModalService } from "../../services/AppModalService";
import { ButtonClickCallback } from "../../fi/hg/frontend/components/button/Button";
import { LogService } from "../../fi/hg/core/LogService";
import {RouteService} from "../../fi/hg/frontend/services/RouteService";
import {getUserRoute, MY_WORKSPACE_LIST_ROUTE} from "../../constants/route";

const LOG = LogService.createLogger('useAppWithRouteCallback');

/**
 * Can be used to create a callback function to open a specific modal
 *
 * @param modal
 * @param id
 */
export function useAppWithRouteCallback (
    modal ?: AppModalType | undefined,
    parentId ?:string | undefined,
    id    ?: string | undefined
) : ButtonClickCallback {
    return useCallback(
        () => {
            const workspaceId = parentId;
            const editedUserRoute = workspaceId && id? getUserRoute(workspaceId, id): MY_WORKSPACE_LIST_ROUTE;

            LOG.info(`Opening modal `, modal, id, workspaceId);
            LOG.info(`Set Route `, editedUserRoute);

            AppModalService.setCurrentModal(modal, id);
            RouteService.setRoute(editedUserRoute);
        },
        [
            modal,
            id,
            parentId
        ]
    );
}
