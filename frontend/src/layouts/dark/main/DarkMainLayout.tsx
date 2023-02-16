// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import {LogService} from "../../../fi/hg/core/LogService";
import {useParams} from "react-router-dom";
import {useUrlWorkspaceName} from "../../../hooks/workspace/useUrlWorkspacename";
import {useEventCurrentWorkspaceChanged} from "../../../hooks/workspace/useEventCurrentWorkspaceChanged";
import {useCallback, useState} from "react";
import {RouteService} from "../../../fi/hg/frontend/services/RouteService";
import {useCurrentWorkspaceName} from "../../../hooks/workspace/useCurrentWorkspaceName";
import {AppModalType} from "../../../types/AppModalType";
import {MY_WORKSPACE_LIST_ROUTE} from "../../../constants/route";
import {AppModalService} from "../../../services/AppModalService";
import "./DarkMainLayout.scss";

const LOG = LogService.createLogger('DarkMainLayout');
export function DarkMainLayout (props: LayoutProps) {
    const children = props.children;
    const t = props.t;

    // urls
    const workspaceName = useCurrentWorkspaceName();

    const opts = useParams<string>();
    const userId = opts?.id ?? undefined;
    const workspaceId = opts?.parentId ?? undefined;

    const [user, setUserId] = useState<string | undefined>(userId);
    const [name, setName ] = useState<string | undefined>(workspaceName);
    const [urlWorkspace]  = useUrlWorkspaceName(workspaceId);

    const workspaceCallback = useCallback(
        () => {
            LOG.info(`Workspace changed`);
            if (urlWorkspace !== undefined || workspaceId !== undefined) {
                setName(urlWorkspace?.name ?? workspaceName);
            }

            if (urlWorkspace !== undefined ) {
                LOG.info(`Workspaces changed; Moving to workspace view`, urlWorkspace);
                setName(urlWorkspace?.name ?? workspaceName);

                // if url with user
                if(user !== undefined ){
                    LOG.info("Open modal with userId", user);

                    RouteService.setRoute('/workspace/'+ urlWorkspace.id +'/users/'+ user);
                    AppModalService.setCurrentModal(AppModalType.EDIT_USER_MODAL, user)
                    LOG.info(`Set userId again undefined`, userId, user)
                    setUserId(undefined)

                }
                // without ticket id
                else {
                    LOG.info("No userId", userId)
                    RouteService.setRoute('/workspace/'+ urlWorkspace.id + "/about");
                }
            }
            // only workspace select button
            else {
                LOG.info(`Set workspaces `, workspaceName)
                setUserId(undefined);
                RouteService.setRoute(MY_WORKSPACE_LIST_ROUTE);
            }

        },
        [setName,
            name, urlWorkspace, workspaceId, workspaceName, userId

        ]
    );

    // setCurrentUser when workspace changed or when moving workspace => setCurrentWorkspace
    useEventCurrentWorkspaceChanged(()=>{
        LOG.info("Workspace CHANGED")
        workspaceCallback()}
    );

    return (
        <div className={DARK_MAIN_LAYOUT_CLASS_NAME}>
            <AppHeader
                className={`${DARK_MAIN_LAYOUT_CLASS_NAME}-header`}
                t={t}
            />
            <section className={`${DARK_MAIN_LAYOUT_CLASS_NAME}-content`}>{children}</section>

        </div>
    );
}
