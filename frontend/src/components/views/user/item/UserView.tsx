// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { USER_VIEW_CLASS_NAME } from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import "./UserView.scss";

export interface UserViewProps {
    readonly t: TFunction;
    readonly className ?: string;
}

export function UserView (props: UserViewProps) {

    const className = props?.className;

    return (
        <div className={
            USER_VIEW_CLASS_NAME
            + (className? ` ${className}` : '')
        }>

            User view

        </div>
    );

}
