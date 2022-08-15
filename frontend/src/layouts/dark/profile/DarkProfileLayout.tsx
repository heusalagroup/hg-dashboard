// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_PROFILE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./DarkProfileLayout.scss";

export function DarkProfileLayout (props: LayoutProps) {
    const className = props?.className;
    const children = props?.children;
    return (
        <div
            className={
                DARK_PROFILE_LAYOUT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >{children}</div>
    );
}
