// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";
import { PROFILE_MENU_BUTTON_CLASS_NAME } from "../../../../constants/appClassName";
import { LOGIN_INDEX_ROUTE } from "../../../../constants/route";
import { useEmailAuthSession } from "../../../../fi/hg/frontend/hooks/useEmailAuthSession";
import { SetProfileMenuOpenCallback } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { SignInIcon } from "../../../../assets/icons";
import { Avatar } from "../../user/avatar/Avatar";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./ProfileMenuButton.scss";

export type ChangeMenuDropdownStateCallback = (value: number) => void;

export interface ProfileMenuButtonProps {
    readonly t: TranslationFunction;
    readonly className?: string;
    readonly isOpen: boolean;
    readonly changeProfileMenuState: SetProfileMenuOpenCallback;
    readonly profileMenuWidth: number | undefined;
    readonly setProfileMenuWidth: ChangeMenuDropdownStateCallback;
}

export function ProfileMenuButton (props: ProfileMenuButtonProps) {

    const className = props?.className;
    const isProfileMenuOpen = props?.isOpen;
    const setProfileMenuOpen = props?.changeProfileMenuState;
    const setProfileMenuDropdownOpen = props?.setProfileMenuWidth;

    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleProfileMenuCallback = useCallback(
        () => {
            const width = buttonRef?.current?.offsetWidth ?? 0;
            setProfileMenuDropdownOpen(width ? width : 200);
            setProfileMenuOpen((value: boolean) => !value);
        },
        [
            setProfileMenuOpen,
            setProfileMenuDropdownOpen
        ]
    );

    const session = useEmailAuthSession();

    return (
        <div
            className={
                PROFILE_MENU_BUTTON_CLASS_NAME +
                (className ? ` ${className}` : "")
            }
        >
            {session.isLoggedIn ? (
                <button
                    ref={buttonRef}
                    className={
                        "hg-button profile-menu-toggle " +
                        (session.isLoggedIn ? "is-logged-in" : "not-logged-in")
                    }
                    onClick={toggleProfileMenuCallback}
                >

                    <Avatar
                        name={''}
                        email={session?.email ?? ''}
                    />

                    {isProfileMenuOpen ? (
                        <span className={"caret caret-up"}>&nbsp;&#9650;</span>
                    ) : (
                        <span className={"caret caret-down"}>&nbsp;&#9660;</span>
                    )}

                </button>

            ) : (
                <NavLink
                    className={"login-link"}
                    to={LOGIN_INDEX_ROUTE}
                ><SignInIcon /></NavLink>
            )}
        </div>
    );
}


