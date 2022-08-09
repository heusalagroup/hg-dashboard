// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { USER_AVATAR_CLASS_NAME } from "../../../../constants/appClassName";
import { Avatar } from "./Avatar";
import { User } from "../../../../fi/hg/dashboard/types/User";
import "./UserAvatar.scss";

export interface UserAvatarProps {
    readonly className ?: string;
    readonly user       : User;
}

export function UserAvatar (props: UserAvatarProps) {
    const className = props?.className;
    const user = props.user;
    return (
        <Avatar
            className={
                USER_AVATAR_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            name={user.name}
            email={user.email}
        />
    );
}
