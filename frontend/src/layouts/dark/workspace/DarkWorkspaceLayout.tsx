// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_WORKSPACE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppNav } from "../../../components/common/layout/appNav/AppNav";
import "./DarkWorkspaceLayout.scss";

export function DarkWorkspaceLayout (props: LayoutProps) {
    const className = props?.className;
    const children = props?.children;
    const t = props?.t;
    return (
        <div className={
            DARK_WORKSPACE_LAYOUT_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <AppNav
                className={`${DARK_WORKSPACE_LAYOUT_CLASS_NAME}-content-nav`}
                t={t}
            />
            <section className={`${DARK_WORKSPACE_LAYOUT_CLASS_NAME}-content-view`}>{children}</section>
        </div>
    );
}
