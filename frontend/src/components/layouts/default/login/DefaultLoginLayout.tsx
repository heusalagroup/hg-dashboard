// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DEFAULT_LOGIN_LAYOUT_CLASS_NAME } from "../../../../constants/appClassName";
import { AppFooter } from "../../../common/layout/appFooter/AppFooter";
import { LayoutProps } from "../../../../types/DashboardLayout";
import "./DefaultLoginLayout.scss";

export function DefaultLoginLayout (props: LayoutProps) {
    const t = props?.t;
    return (
        <div className={DEFAULT_LOGIN_LAYOUT_CLASS_NAME}>
            <section className={`${DEFAULT_LOGIN_LAYOUT_CLASS_NAME}-content`}>{props.children}</section>
            <AppFooter className={`${DEFAULT_LOGIN_LAYOUT_CLASS_NAME}-footer`} t={t} />
        </div>
    );
}
