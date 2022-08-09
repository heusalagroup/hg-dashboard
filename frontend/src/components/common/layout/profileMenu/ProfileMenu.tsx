// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { PROFILE_MENU_CLASS_NAME } from "../../../../constants/appClassName";
import { NavLink } from "react-router-dom";
import {
    MY_PROFILE_ROUTE, WORKSPACE_LIST_ROUTE
} from "../../../../constants/route";
import {
    T_PROFILE_MENU_NAV_LOG_OUT,
    T_PROFILE_MENU_NAV_PROFILE, T_PROFILE_MENU_NAV_WORKSPACES
} from "../../../../constants/translation";
import { SessionService } from "../../../../services/SessionService";
import { useCallback, MouseEvent } from "react";
import { TFunction } from "i18next";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { VoidCallback } from "../../../../fi/hg/core/interfaces/callbacks";
import "./ProfileMenu.scss";

export interface ProfileMenuProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly closeMenu: VoidCallback;

    /**
     * Aaa arvon profilemenubuttonilta > laittaa sen width arvoksi
     */
    readonly profileMenuWidth ?: number | undefined;

}

export function ProfileMenu (props: ProfileMenuProps) {

    const t = props?.t;
    const className = props?.className;
    const closeMenu = props.closeMenu;
    const profileMenuWidth = props?.profileMenuWidth ?? 0;

    const session = useEmailAuthSession();

    const closeMenuCallback = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            closeMenu();
        },
        [
            closeMenu
        ]
    );

    const voidDivClickCallback = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        []
    );

    const logoutCallback = useCallback(
        () => {
            SessionService.logout();
            closeMenu();
        },
        [
            closeMenu
        ]
    );

    return (
        <div
            className={
                PROFILE_MENU_CLASS_NAME + (className ? ` ${className}` : "")
            }
            onClick={closeMenuCallback}
        >
            <div
                className={`${PROFILE_MENU_CLASS_NAME}-content`}
                style={{width: profileMenuWidth}}
                onClick={voidDivClickCallback}
            >{
                session.isLoggedIn ? (
                    <nav className={`${PROFILE_MENU_CLASS_NAME}-content-nav`}>

                        <NavLink
                            to={MY_PROFILE_ROUTE}
                            className={`${PROFILE_MENU_CLASS_NAME}-content-nav-item ${PROFILE_MENU_CLASS_NAME}-content-nav-link`}
                        >{t(T_PROFILE_MENU_NAV_PROFILE)}</NavLink>

                        <NavLink
                            to={WORKSPACE_LIST_ROUTE}
                            className={`${PROFILE_MENU_CLASS_NAME}-content-nav-item ${PROFILE_MENU_CLASS_NAME}-content-nav-link`}
                        >{t(T_PROFILE_MENU_NAV_WORKSPACES)}</NavLink>

                        <button
                            className={`${PROFILE_MENU_CLASS_NAME}-content-nav-item ${PROFILE_MENU_CLASS_NAME}-content-nav-button`}
                            onClick={logoutCallback}
                        >{t(T_PROFILE_MENU_NAV_LOG_OUT)}</button>

                    </nav>
                ) : null
            }</div>
        </div>
    );
}


