// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WORKSPACE_LIST_VIEW_CLASS_NAME } from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import {
    T_WORKSPACE_LIST_TITLE,
    T_WORKSPACE_TABLE_NAME_TITLE,
    T_WORKSPACE_LIST_VIEW_NO_RESULTS
} from "../../../../constants/translation";
import { map } from "../../../../fi/hg/core/modules/lodash";
import { OpenNewWorkspaceModalButton } from "../../../common/workspace/openNewWorkspaceModalButton/OpenNewWorkspaceModalButton";
import { SelectWorkspaceButton } from "../../../common/workspace/selectWorkspaceButton/SelectWorkspaceButton";
import { LogService } from "../../../../fi/hg/core/LogService";
import { useIntervalUpdate } from "../../../../fi/hg/frontend/hooks/useIntervalUpdate";
import { WORKSPACE_LIST_UPDATE_INTERVAL_IN_MS } from "../../../../constants/frontend";
import { Loader } from "../../../../fi/hg/frontend/components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { ABOUT_ROUTE } from "../../../../constants/route";
import { useCallback } from "react";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { EmailUtils } from "../../../../fi/hg/core/EmailUtils";
import { useWorkspaceList } from "../../../../hooks/workspace/useWorkspaceList";
import { VALID_ADMIN_DOMAINS } from "../../../../fi/hg/dashboard/constants/dashboard-api";
import { useEventWorkspaceAdded } from "../../../../hooks/workspace/useEventWorkspaceAdded";
import { useEventWorkspaceUpdated } from "../../../../hooks/workspace/useEventWorkspaceUpdated";
import { useEventWorkspaceRemoved } from "../../../../hooks/workspace/useEventWorkspaceRemoved";
import { useEventCurrentWorkspaceChanged } from "../../../../hooks/workspace/useEventCurrentWorkspaceChanged";
import { Workspace } from "../../../../fi/hg/dashboard/types/Workspace";
import "./WorkspaceListView.scss";

const LOG = LogService.createLogger('WorkspaceListView');

export interface WorkspaceListViewProps {
    readonly t: TFunction;
    readonly className ?: string;
}

export function WorkspaceListView (props: WorkspaceListViewProps) {

    const t = props?.t;
    const className = props?.className;
    const [workspaceList, refreshCallback] = useWorkspaceList();

    const navigate = useNavigate();

    const session = useEmailAuthSession();
    const email = session?.email;
    const emailDomain = email ? EmailUtils.getEmailDomain(email) : undefined;
    LOG.debug(`emailDomain: `, emailDomain, email, VALID_ADMIN_DOMAINS);
    const canCreateWorkspace = emailDomain ? VALID_ADMIN_DOMAINS.includes(emailDomain) : false;

    const workspaceAddedCallback = useCallback(
        () => {
            LOG.debug(`Workspace changed, move to about view`);
            refreshCallback();
            navigate(ABOUT_ROUTE);
        },
        [
            navigate,
            refreshCallback
        ]
    );

    useEventWorkspaceAdded(refreshCallback);
    useEventWorkspaceUpdated(refreshCallback);
    useEventWorkspaceRemoved(refreshCallback);
    useEventCurrentWorkspaceChanged(workspaceAddedCallback);

    // FIXME: This should be done using events from backend
    useIntervalUpdate(
        refreshCallback,
        WORKSPACE_LIST_UPDATE_INTERVAL_IN_MS
    );

    if (workspaceList === undefined) {
        return <Loader />;
    }

    return (
        <div className={
            WORKSPACE_LIST_VIEW_CLASS_NAME
            + (className? ` ${className}` : '')
        }>

            <header className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-header'}>
                <h3 className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-header-title'}>{t(T_WORKSPACE_LIST_TITLE)}</h3>
                <div className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-header-controls'}>
                    {canCreateWorkspace? (
                        <OpenNewWorkspaceModalButton />
                    ) : null}
                </div>
            </header>

            <table className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-table'}>
                <thead>
                <tr>
                    <th>{t(T_WORKSPACE_TABLE_NAME_TITLE)}</th>
                </tr>
                </thead>
                <tbody>{
                    (workspaceList?.length ?? 0) === 0 ? (
                        <>
                            <tr>
                                <td className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-no-results'}>{t(T_WORKSPACE_LIST_VIEW_NO_RESULTS)}</td>
                            </tr>
                        </>
                    ) : map(workspaceList, (item : Workspace) => {
                        return (
                            <tr key={`workspace-item-${item?.id}`}>
                                <td className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-column-name'}>
                                    <SelectWorkspaceButton
                                        className={WORKSPACE_LIST_VIEW_CLASS_NAME+'-workspace-button'}
                                        workspace={item}>{ (item.name === '' ? undefined : item.name) ?? item.id }</SelectWorkspaceButton>
                                </td>
                            </tr>
                        );
                    })
                }</tbody>
            </table>

        </div>
    );

}
