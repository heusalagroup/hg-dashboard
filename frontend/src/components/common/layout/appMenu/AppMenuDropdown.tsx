// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { APP_MENU_DROPDOWN_CLASS_NAME } from "../../../../constants/appClassName";
import { AppMenuButton } from "./AppMenuButton";
import { AppMenu } from "./AppMenu";
import { useDropdownToggleWithoutWindowSizeAndScroll } from "../../../../fi/hg/frontend/hooks/useDropdownToggleWithoutWindowSizeAndScroll";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./AppMenuDropdown.scss";

export interface AppMenuDropdownProps {
    readonly t: TranslationFunction;
    readonly className ?: string;
}

export function AppMenuDropdown (props: AppMenuDropdownProps) {

    const t = props?.t;
    const className = props?.className;
    const [ isMenuOpen, setMenuOpen ] = useDropdownToggleWithoutWindowSizeAndScroll(false);

    return (
        <div className={
            APP_MENU_DROPDOWN_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <AppMenuButton
                className={`${APP_MENU_DROPDOWN_CLASS_NAME}-button`}
                t={t}
                isOpen={isMenuOpen}
                changeMenuState={setMenuOpen}
            />
            <div className={`${APP_MENU_DROPDOWN_CLASS_NAME}-items`}>
                {isMenuOpen ? (
                    <AppMenu
                        t={t}
                        changeMenuState={setMenuOpen}
                    />
                ) : null}
            </div>
        </div>
    );

}
