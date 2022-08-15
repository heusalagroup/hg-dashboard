// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_LOGIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppFooter } from "../../../components/common/layout/appFooter/AppFooter";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./DarkLoginLayout.scss";

export function DarkLoginLayout (props: LayoutProps) {
    const t = props?.t;
    return (
        <div className={DARK_LOGIN_LAYOUT_CLASS_NAME}>
            <section className={`${DARK_LOGIN_LAYOUT_CLASS_NAME}-content`}>{props.children}</section>
            <AppFooter className={`${DARK_LOGIN_LAYOUT_CLASS_NAME}-footer`} t={t} />
        </div>
    );
}
