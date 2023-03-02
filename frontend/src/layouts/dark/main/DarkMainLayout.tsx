// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import {LogService} from "../../../fi/hg/core/LogService";
import {useParams} from "react-router-dom";
import {useUrlLink} from "../../../hooks/workspace/useUrlLink";
import "./DarkMainLayout.scss";
import {AppModalType} from "../../../types/AppModalType";
import {AppModalService} from "../../../services/AppModalService";
import {useCurrentWorkspaceName} from "../../../hooks/workspace/useCurrentWorkspaceName";

const LOG = LogService.createLogger('DarkMainLayout');
export function DarkMainLayout (props: LayoutProps) {
    const children = props.children;
    const t = props.t;

    const opts = useParams<string>();
    const userId = opts?.id ?? undefined;
    const workspaceId = opts?.parentId ?? undefined;

    const openModal = useUrlLink(workspaceId, userId);

    const workspaceName = useCurrentWorkspaceName();

    if(!workspaceName){
        openModal();
    }

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
