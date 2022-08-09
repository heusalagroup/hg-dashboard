// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { TFunction } from "i18next";
import { APP_MENU_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import {
    T_APP_HEADER_NAV_USERS
} from "../../../../constants/translation";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { SetProfileMenuOpenCallback } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { useLocation } from "react-router-dom";
import {
    USER_LIST_ROUTE
} from "../../../../constants/route";
import { startsWith } from "../../../../fi/hg/core/modules/lodash";
import "./AppMenuButton.scss";

export interface AppMenuButtonProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly isOpen: boolean;
    readonly changeMenuState: SetProfileMenuOpenCallback;
}

export function AppMenuButton (props: AppMenuButtonProps) {

    const className = props?.className;
    const isMenuOpen = props?.isOpen;
    const t = props?.t;
    const setMenuOpen = props?.changeMenuState;

    const {pathname} = useLocation();

    const toggleMenuCallback = useCallback(() => {

        setMenuOpen((value: boolean) => !value);
    }, [ setMenuOpen ]);

    const session = useEmailAuthSession();

    return (
        <div
            className={
                APP_MENU_BUTTON_CLASS_NAME +
                (className ? ` ${className}` : "")
            }
        >
            {session.isLoggedIn ? (
                <button
                    className={
                        "hg-button menu-toggle " +
                        (session.isLoggedIn ? "is-logged-in" : "not-logged-in")
                    }
                    onClick={toggleMenuCallback}
                >

                    {isMenuOpen ? (
                        <span className={"caret caret-up"}>&nbsp;&#9650;</span>
                    ) : (
                        <span className={"caret caret-down"}>
                            &nbsp;&#9660;
                        </span>
                    )}
                </button>
            ) : (
                null
            )}
        </div>
    );
}


