// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NavLink } from "react-router-dom";
import {
    INDEX_ROUTE
} from "../../../../constants/route";
import {
    T_COMMON_COMPANY_NAME
} from "../../../../constants/translation";
import { APP_HEADER_CLASS_NAME } from "../../../../constants/appClassName";
import { ProfileMenuDropdown } from "../profileMenu/ProfileMenuDropdown";
import { useCurrentWorkspaceName } from "../../../../hooks/workspace/useCurrentWorkspaceName";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./AppHeader.scss";

export interface AppHeaderProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function AppHeader (props: AppHeaderProps) {
    const t = props?.t;
    const className = props?.className;
    const workspaceName = useCurrentWorkspaceName();
    return (
        <header
            className={APP_HEADER_CLASS_NAME + (className ? ` ${className}` : "")}
        >
            <nav className={`${APP_HEADER_CLASS_NAME}-nav`}>

                <div className={`${APP_HEADER_CLASS_NAME}-menu`}>
                    <h1 className={`${APP_HEADER_CLASS_NAME}-logo-container`}>
                        <NavLink
                            className={`${APP_HEADER_CLASS_NAME}-logo-link`}
                            to={INDEX_ROUTE}
                        >{(workspaceName ? workspaceName : undefined) ?? t(T_COMMON_COMPANY_NAME)}</NavLink>
                    </h1>
                </div>

                <div className={`${APP_HEADER_CLASS_NAME}-profile-menu`}>
                    <ProfileMenuDropdown t={t} className={`${APP_HEADER_CLASS_NAME}-profile-menu-dropdown`} />
                </div>

            </nav>
        </header>
    );
}
