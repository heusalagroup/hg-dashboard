// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NONE_PROFILE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./NoneProfileLayout.scss";

export function NoneProfileLayout (props: LayoutProps) {
    const className = props?.className;
    return (
        <div
            className={
                NONE_PROFILE_LAYOUT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >{props.children}</div>
    );
}
