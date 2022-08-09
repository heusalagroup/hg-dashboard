// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { WORKSPACE_FORM_CLASS_NAME } from "../../../constants/appClassName";
import { Form } from "../../../fi/hg/frontend/components/form/Form";
import { TextField } from "../../../fi/hg/frontend/components/fields/text/TextField";
import { Button } from "../../../fi/hg/frontend/components/button/Button";
import { ButtonType } from "../../../fi/hg/frontend/components/button/types/ButtonType";
import {
    T_WORKSPACE_FORM_NAME_PLACEHOLDER,
    T_NEW_WORKSPACE_MODAL_SUBMIT_TEXT
} from "../../../constants/translation";
import { useWorkspaceForm } from "../../../hooks/workspace/useWorkspaceForm";
import { Workspace } from "../../../fi/hg/dashboard/types/Workspace";
import { TranslationFunction } from "../../../fi/hg/core/types/TranslationFunction";
import "./WorkspaceForm.scss";

export interface WorkspaceFormProps {
    readonly t          : TranslationFunction;
    readonly className ?: string;
    readonly workspace ?: Partial<Workspace>;
}

export function WorkspaceForm (props: WorkspaceFormProps) {
    const t = props?.t;
    const className = props?.className;
    const {
        workspace,
        setWorkspace,
        submitCallback
    } = useWorkspaceForm(props?.workspace);
    return (
        <Form
            className={
                WORKSPACE_FORM_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            submit={submitCallback}
        >

            <TextField
                value={workspace.name}
                placeholder={t(T_WORKSPACE_FORM_NAME_PLACEHOLDER)}
                change={(newValue) => setWorkspace({name: newValue})}
            />

            <Button click={submitCallback} type={ButtonType.SUBMIT}>{t(T_NEW_WORKSPACE_MODAL_SUBMIT_TEXT)}</Button>

        </Form>
    );

}
