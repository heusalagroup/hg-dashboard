// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import {LogService} from "../../../fi/hg/core/LogService";
import {useParams} from "react-router-dom";
import {useUrlWorkspaceName} from "../../../hooks/workspace/useUrlWorkspacename";
import "./DarkMainLayout.scss";

const LOG = LogService.createLogger('DarkMainLayout');
export function DarkMainLayout (props: LayoutProps) {
    const children = props.children;
    const t = props.t;

    const opts = useParams<string>();
    const userId = opts?.id ?? undefined;
    const workspaceId = opts?.parentId ?? undefined;

    useUrlWorkspaceName(workspaceId, userId);

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
