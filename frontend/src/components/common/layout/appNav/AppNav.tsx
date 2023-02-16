// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { APP_NAV_CLASS_NAME } from "../../../../constants/appClassName";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import { NavLink } from "react-router-dom";
import { ABOUT_ROUTE } from "../../../../constants/route";
import { T_APP_HEADER_NAV_HOME, T_APP_HEADER_NAV_USERS } from "../../../../constants/translation";
import { Icon } from "../../../../fi/hg/frontend/components/icon/Icon";
import { HomeIcon, UserListIcon } from "../../../../assets/icons";
import {useCurrentWorkspaceId} from "../../../../hooks/workspace/useCurrentWorkspaceId";
import "./AppNav.scss";

export interface AppNavProps {
    readonly t : TranslationFunction;
    readonly className ?: string;
}

export function AppNav (props: AppNavProps) {

    const t = props?.t;
    const className = props?.className;

    const workspace = useCurrentWorkspaceId();

    return (
        <nav className={
            APP_NAV_CLASS_NAME
            + (className? ` ${className}` : '')
        }>

            <section className={APP_NAV_CLASS_NAME+'-section'}>

                <header className={APP_NAV_CLASS_NAME+'-section-header'}>

                </header>

                <NavLink
                    className={`${APP_NAV_CLASS_NAME}-section-item`}
                    to={ABOUT_ROUTE}
                ><Icon><HomeIcon /></Icon> <span className={`${APP_NAV_CLASS_NAME}-section-item-text`}>{t(T_APP_HEADER_NAV_HOME)}</span></NavLink>

                <NavLink
                    className={`${APP_NAV_CLASS_NAME}-section-item`}
                    //to={USER_LIST_ROUTE}
                    to={"/workspace/"+ `${workspace}` + "/users"}
                ><Icon><UserListIcon /></Icon> <span className={`${APP_NAV_CLASS_NAME}-section-item-text`}>{t(T_APP_HEADER_NAV_USERS)}</span></NavLink>

            </section>

        </nav>
    );

}
