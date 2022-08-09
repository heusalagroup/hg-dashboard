// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { USER_FORM_CLASS_NAME } from "../../../constants/appClassName";
import { Form } from "../../../fi/hg/frontend/components/form/Form";
import { TextField } from "../../../fi/hg/frontend/components/fields/text/TextField";
import { Button } from "../../../fi/hg/frontend/components/button/Button";
import { ButtonType } from "../../../fi/hg/frontend/components/button/types/ButtonType";
import { T_USER_FORM_EMAIL_PLACEHOLDER, T_USER_FORM_NAME_PLACEHOLDER, T_NEW_USER_MODAL_SUBMIT_TEXT } from "../../../constants/translation";
import { useWorkspaceUserForm } from "../../../hooks/user/useWorkspaceUserForm";
import { EmailField } from "../../../fi/hg/frontend/components/fields/email/EmailField";
import { User } from "../../../fi/hg/dashboard/types/User";
import { TranslationFunction } from "../../../fi/hg/core/types/TranslationFunction";
import "./UserForm.scss";

export interface UserFormProps {
    readonly t            : TranslationFunction;
    readonly className   ?: string;
    readonly workspaceId ?: string;
    readonly user        ?: Partial<User>;
}

export function UserForm (props: UserFormProps) {

    const t = props?.t;
    const className = props?.className;
    const workspaceId = props?.workspaceId;
    const initialUser = props?.user;

    const {
        user,
        setUser,
        submitCallback
    } = useWorkspaceUserForm(workspaceId, initialUser);

    return (
        <Form
            className={
                USER_FORM_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            submit={submitCallback}
        >

            <TextField
                value={user.name}
                placeholder={t(T_USER_FORM_NAME_PLACEHOLDER)}
                change={(newValue) => setUser({name: newValue})}
            />

            <EmailField
                value={user.email}
                placeholder={t(T_USER_FORM_EMAIL_PLACEHOLDER)}
                change={(newValue) => setUser({email: newValue})}
            />

            <Button click={submitCallback} type={ButtonType.SUBMIT}>{t(T_NEW_USER_MODAL_SUBMIT_TEXT)}</Button>

        </Form>
    );

}
