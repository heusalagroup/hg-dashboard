// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NONE_LOGIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppFooter } from "../../../components/common/layout/appFooter/AppFooter";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./NoneLoginLayout.scss";

export function NoneLoginLayout (props: LayoutProps) {
    const t = props?.t;
    return (
        <div className={NONE_LOGIN_LAYOUT_CLASS_NAME}>
            <section className={`${NONE_LOGIN_LAYOUT_CLASS_NAME}-content`}>{props.children}</section>
            <AppFooter className={`${NONE_LOGIN_LAYOUT_CLASS_NAME}-footer`} t={t} />
        </div>
    );
}
