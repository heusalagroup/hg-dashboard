// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { PROFILE_VIEW_CLASS_NAME } from "../../../constants/appClassName";
import { TFunction } from "i18next";
import {
    T_PROFILE_VIEW_CONTENT,
    T_PROFILE_VIEW_TITLE
} from "../../../constants/translation";
import { useCallback } from "react";
import { EmailAuthSessionService } from "../../../fi/hg/frontend/services/EmailAuthSessionService";
import { useEventSessionProfileUpdated } from "../../../hooks/session/useEventSessionProfileUpdated";
import "./ProfileView.scss";

export interface ProfileViewProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function ProfileView (props: ProfileViewProps) {

    const t = props?.t;
    const className = props?.className;

    const email: string | undefined = EmailAuthSessionService.getEmailAddress();

    const translationParams = {
        EMAIL: email
    };

    const onUpdateProfile = useCallback(
        () => {
        }, [
        ]
    );

    useEventSessionProfileUpdated(onUpdateProfile);

    return (
        <>
            <div
                className={
                    PROFILE_VIEW_CLASS_NAME
                    + (className ? ` ${className}` : '')
                }
            >
                <article>
                    <h2>{t(T_PROFILE_VIEW_TITLE, translationParams)}</h2>
                    <p>{t(T_PROFILE_VIEW_CONTENT, translationParams)}</p>
                </article>
            </div>
        </>
    );

}
