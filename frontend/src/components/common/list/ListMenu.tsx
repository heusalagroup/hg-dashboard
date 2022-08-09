// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LIST_MENU_CLASS_NAME } from "../../../constants/appClassName";
import { NavLink } from "react-router-dom";
import {
    TICKETS_INDEX_ROUTE,
    TICKETS_PURCHASING_ROUTE,
    TICKETS_ORDERS_ROUTE,
    TICKETS_REQUESTS_ROUTE,
    TICKETS_INVOICING_ROUTE
} from "../../../constants/route";
import {
    T_LIST_MENU_NAV_ALL,
    T_LIST_MENU_NAV_REQUEST,
    T_LIST_MENU_NAV_PURCHASING,
    T_LIST_MENU_NAV_ORDERS,
    T_LIST_MENU_NAV_INVOICING
} from "../../../constants/translation";
import { useState } from "react";
import { TFunction } from "i18next";
import { useEmailAuthSession } from "../../../fi/hg/frontend/hooks/useEmailAuthSession";
import "./ListMenu.scss";

export interface ListMenuProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly profileMenuWidth?: number | undefined;
}

export function ListMenu (props: ListMenuProps) {

    const t = props?.t;
    const className = props?.className;
    const howMany: number = 9;
    /** saa arvon profilemenubuttonilta > laittaa sen width arvoksi */
    const widthProfileMenu = props.profileMenuWidth;
    const [ active, setActive ] = useState('active');
    const {isLoggedIn} = useEmailAuthSession();

    return (
        <div className={LIST_MENU_CLASS_NAME + (className ? ` ${className}` : "")}>
            <div
                className={`${LIST_MENU_CLASS_NAME}-content`}
                style={{width: widthProfileMenu}}
            >{isLoggedIn ? (
                <nav className={`${LIST_MENU_CLASS_NAME}-content-list-nav`}>

                    <NavLink
                        to={TICKETS_INDEX_ROUTE}
                        className={`${active}-background-cover list-nav-link`}
                    >
                        <button
                            className={active === "active" ? "b" : "none"}
                            onClick={() => setActive("active")}
                        >
                            {t(T_LIST_MENU_NAV_ALL)}&nbsp;({howMany})
                        </button>
                    </NavLink>

                    <NavLink
                        to={TICKETS_REQUESTS_ROUTE}
                        onClick={() => setActive("not")}
                        className={'list-nav-link'}
                    >
                        {t(T_LIST_MENU_NAV_REQUEST)}&nbsp;({howMany})
                        <span className="arrow">&#9002;</span>
                    </NavLink>

                    <NavLink
                        to={TICKETS_PURCHASING_ROUTE}
                        onClick={() => setActive("not")}
                        className={'list-nav-link'}
                    >{t(T_LIST_MENU_NAV_PURCHASING)}&nbsp;({howMany})
                        <span className="arrow">&#9002;</span>
                    </NavLink>

                    <NavLink
                        to={TICKETS_ORDERS_ROUTE}
                        onClick={() => setActive("not")}
                        className={'list-nav-link'}
                    >{t(T_LIST_MENU_NAV_ORDERS)}
                        <span className="arrow">&#9002;</span>
                    </NavLink>

                    <NavLink
                        to={TICKETS_INVOICING_ROUTE}
                        onClick={() => setActive("not")}
                        className={'list-nav-link'}
                    >{t(T_LIST_MENU_NAV_INVOICING)}
                    </NavLink>

                </nav>

            ) : null}</div>
        </div>
    );
}
