// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NavLink, useLocation } from "react-router-dom";
import {
    INDEX_ROUTE, TICKETS_INDEX_ROUTE
} from "../../../../constants/route";
import { TFunction } from "i18next";
import {
    T_COMMON_COMPANY_NAME
} from "../../../../constants/translation";
import { APP_HEADER_CLASS_NAME } from "../../../../constants/appClassName";
import { useDropdownToggleWithoutWindowSizeAndScroll } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { TicketListControls } from "../../ticket/ticketListControls/TicketListControls";
import { AppMenuDropdown } from "../appMenu/AppMenuDropdown";
import { ProfileMenuDropdown } from "../profileMenu/ProfileMenuDropdown";
import { startsWith } from "../../../../fi/hg/core/modules/lodash";
import { useCurrentWorkspaceName } from "../../../../hooks/workspace/useCurrentWorkspaceName";
import "./AppHeader.scss";

export interface AppHeaderProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function AppHeader (props: AppHeaderProps) {

    const t = props?.t;
    const className = props?.className;
    const {pathname} = useLocation();
    const [isListMenuClose, setListMenuClose] = useDropdownToggleWithoutWindowSizeAndScroll(true);
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
                    {workspaceName !== undefined ? (
                        <AppMenuDropdown
                            t={t}
                            className={`${APP_HEADER_CLASS_NAME}-menu-dropdown`}
                        />
                    ) : null}
                </div>

                {pathname === TICKETS_INDEX_ROUTE || startsWith(pathname, `${TICKETS_INDEX_ROUTE}/`) ? (
                    <TicketListControls
                        className={`${APP_HEADER_CLASS_NAME}-ticket-controls`}
                        t={t}
                        isDropdownOpen={isListMenuClose}
                        setDropdownOpen={setListMenuClose}
                    />
                ) : null}

                <div className={`${APP_HEADER_CLASS_NAME}-profile-menu`}>
                    <ProfileMenuDropdown t={t} className={`${APP_HEADER_CLASS_NAME}-profile-menu-dropdown`} />
                </div>

            </nav>
        </header>
    );
}
