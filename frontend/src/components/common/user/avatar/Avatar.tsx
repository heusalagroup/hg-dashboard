// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { AVATAR_CLASS_NAME } from "../../../../constants/appClassName";
import "./Avatar.scss";

export interface AvatarProps {
    readonly className ?: string;
    readonly name       : string;
    readonly email      : string;
}

export function Avatar (props: AvatarProps) {
    const className = props?.className;
    const initials = UserUtils.getInitials(props?.name, props?.email);
    return (
        <div className={
            AVATAR_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            <div className={AVATAR_CLASS_NAME+'-initials'}>
                <div className={AVATAR_CLASS_NAME+'-initials-text'}>{initials}</div>
            </div>
        </div>
    );
}
