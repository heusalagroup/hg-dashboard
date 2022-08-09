// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { APP_MENU_CLASS_NAME } from "../../../../constants/appClassName";
import { NavLink } from "react-router-dom";
import {
    USER_LIST_ROUTE
} from "../../../../constants/route";
import {
    T_APP_HEADER_NAV_USERS
} from "../../../../constants/translation";
import { useCallback, MouseEvent } from "react";
import { TFunction } from "i18next";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { SetProfileMenuOpenCallback } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import "./AppMenu.scss";

export interface MenuProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly changeMenuState: SetProfileMenuOpenCallback;
}

export function AppMenu (props: MenuProps) {
    const t = props?.t;
    const className = props?.className;
    const setMenuOpen = props.changeMenuState;

    const session = useEmailAuthSession();

    const closeMenuCallback = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            if ( event ) {
                event.preventDefault();
                event.stopPropagation();
            }
            setMenuOpen(false);
        },
        [ setMenuOpen ]
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

    return (
        <div
            className={
                APP_MENU_CLASS_NAME + (className ? ` ${className}` : "")
            }
            onClick={closeMenuCallback}
        >
            <div
                className={`${APP_MENU_CLASS_NAME}-content`}
                onClick={voidDivClickCallback}
            >

                {
                    session.isLoggedIn ? (
                        <nav className={`${APP_MENU_CLASS_NAME}-content-nav`}>

                            <NavLink
                                className={`${APP_MENU_CLASS_NAME}-content-nav-item`}
                                to={USER_LIST_ROUTE}
                            >{t(T_APP_HEADER_NAV_USERS)}</NavLink>

                        </nav>
                    ) : null
                }
            </div>
        </div>
    );
}
