// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import "./DarkMainLayout.scss";

export function DarkMainLayout (props: LayoutProps) {
    const children = props.children;
    const t = props.t;
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
