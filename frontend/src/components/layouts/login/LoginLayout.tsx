// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { TFunction } from "i18next";
import { LOGIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppFooter } from "../../common/layout/appFooter/AppFooter";
import "./LoginLayout.scss";

export interface LoginLayoutProps {
    readonly t: TFunction;
    readonly children: ReactNode;
}

export function LoginLayout (props: LoginLayoutProps) {
    const t = props?.t;
    return (
        <div className={LOGIN_LAYOUT_CLASS_NAME}>
            <section className={`${LOGIN_LAYOUT_CLASS_NAME}-content`}>{props.children}</section>
            <AppFooter className={`${LOGIN_LAYOUT_CLASS_NAME}-footer`} t={t} />
        </div>
    );
}
