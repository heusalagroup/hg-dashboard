// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NONE_WORKSPACE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./NoneWorkspaceLayout.scss";

export function NoneWorkspaceLayout (props: LayoutProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <div className={
            NONE_WORKSPACE_LAYOUT_CLASS_NAME
            + (className? ` ${className}` : '')
        }>{children}</div>
    );
}
