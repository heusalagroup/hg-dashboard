// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LOGIN_VIEW_CLASS_NAME } from "../../../constants/appClassName";
import { TFunction } from "i18next";
import { LoginForm } from "../../forms/loginForm/LoginForm";
import {
    T_LOGIN_FORM_TITLE
} from "../../../constants/translation";
import "./LoginView.scss";

export interface LoginViewProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function LoginView (props: LoginViewProps) {
    const t = props?.t;
    const className = props?.className;
    return (
        <div className={
            LOGIN_VIEW_CLASS_NAME
            + (className ? ` ${className}` : '')
        }>
            <h2>{t(T_LOGIN_FORM_TITLE)}</h2>
            <LoginForm className={`${LOGIN_VIEW_CLASS_NAME}-article`} t={t} />
        </div>
    );
}
