// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { PROFILE_MENU_DROPDOWN_CLASS_NAME } from "../../../../constants/appClassName";
import { ProfileMenuButton } from "./ProfileMenuButton";
import { ProfileMenu } from "./ProfileMenu";
import { useCallback, useState } from "react";
import { useDropdownToggleWithoutWindowSizeAndScroll } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./ProfileMenuDropdown.scss";

const INITIAL_PROFILE_MENU_WIDTH = 80;

export interface ProfileMenuDropdownProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function ProfileMenuDropdown (props: ProfileMenuDropdownProps) {

    const t = props?.t;
    const className = props?.className;

    const [ isProfileMenuOpen, setProfileMenuOpen ] = useDropdownToggleWithoutWindowSizeAndScroll(false);

    /** Asetetaan alkuarvot, koska saadaan arvo vasta painettaessa dropdownia,
     * leveys arvo saattaa tässä vaiheessa olla undefined
     */
    const [ profileMenuWidth, setProfileMenuWidth ] = useState<number>(INITIAL_PROFILE_MENU_WIDTH);

    const closeMenu = useCallback(
        () => setProfileMenuOpen(false),
        [
            setProfileMenuOpen
        ]
    );

    return (
        <div
            className={
                PROFILE_MENU_DROPDOWN_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >

            <ProfileMenuButton
                className={`${PROFILE_MENU_DROPDOWN_CLASS_NAME}-button`}
                t={t}
                isOpen={isProfileMenuOpen}
                changeProfileMenuState={setProfileMenuOpen}
                setProfileMenuWidth={setProfileMenuWidth}
                profileMenuWidth={profileMenuWidth}
            />

            <div className={`${PROFILE_MENU_DROPDOWN_CLASS_NAME}-items`}>
                {isProfileMenuOpen ? (
                    <ProfileMenu
                        className={`${PROFILE_MENU_DROPDOWN_CLASS_NAME}-items-menu`}
                        t={t}
                        profileMenuWidth={profileMenuWidth}
                        closeMenu={closeMenu}
                    />
                ) : null}
            </div>

        </div>
    );

}
