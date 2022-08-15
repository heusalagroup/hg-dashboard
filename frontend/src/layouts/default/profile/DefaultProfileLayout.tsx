// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DEFAULT_PROFILE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./DefaultProfileLayout.scss";

export function DefaultProfileLayout (props: LayoutProps) {
    const className = props?.className;
    return (
        <div
            className={
                DEFAULT_PROFILE_LAYOUT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >{props.children}</div>
    );
}
