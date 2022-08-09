// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { PROFILE_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { TFunction } from "i18next";
import "./ProfileLayout.scss";

export interface ProfileLayoutProps {
    readonly t: TFunction;
    readonly className?: string;
    readonly children: ReactNode;
}

export function ProfileLayout (props: ProfileLayoutProps) {

    const className = props?.className;

    return (
        <div
            className={
                PROFILE_LAYOUT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
        >{props.children}</div>
    );

}


