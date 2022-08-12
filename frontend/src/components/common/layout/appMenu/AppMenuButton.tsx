// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { APP_MENU_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { SetProfileMenuOpenCallback } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./AppMenuButton.scss";

export interface AppMenuButtonProps {
    readonly t: TranslationFunction;
    readonly className?: string;
    readonly isOpen: boolean;
    readonly changeMenuState: SetProfileMenuOpenCallback;
}

export function AppMenuButton (props: AppMenuButtonProps) {

    const className = props?.className;
    const isMenuOpen = props?.isOpen;
    const setMenuOpen = props?.changeMenuState;

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
            ) : null}
        </div>
    );
}


