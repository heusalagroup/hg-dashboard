// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { USER_FIELD_CLASS_NAME } from "../../../constants/appClassName";
import { StyleScheme } from "../../../fi/hg/frontend/types/StyleScheme";
import { SelectFieldModel } from "../../../fi/hg/frontend/types/items/SelectFieldModel";
import { FieldChangeCallback } from "../../../fi/hg/frontend/hooks/field/useFieldChangeCallback";
import { FormFieldState } from "../../../fi/hg/frontend/types/FormFieldState";
import { ReactNode } from "react";
import { ThemeService } from "../../../fi/hg/frontend/services/ThemeService";
import { useSelectField } from "../../../fi/hg/frontend/hooks/field/useSelectField";
import { SelectTemplate } from "../../../fi/hg/frontend/components/fields/select/SelectTemplate";
import { useUserSelectFieldItemList } from "../../../hooks/user/useUserSelectFieldItemList";
import { User } from "../../../fi/hg/dashboard/types/User";

const COMPONENT_CLASS_NAME = USER_FIELD_CLASS_NAME;
const CLOSE_DROPDOWN_TIMEOUT_ON_BLUR = 100;
const MOVE_TO_ITEM_ON_OPEN_DROPDOWN_TIMEOUT = 100;

export interface UserFieldProps {
    readonly className   ?: string;
    readonly style       ?: StyleScheme;
    readonly label       ?: string;
    readonly placeholder ?: string;
    readonly model       ?: SelectFieldModel<string>;
    readonly value       ?: string;
    readonly change      ?: FieldChangeCallback<string | undefined>;
    readonly changeState ?: FieldChangeCallback<FormFieldState>;
    readonly values       : readonly User[] | undefined;
    readonly children    ?: ReactNode;
}

export function UserField (props: UserFieldProps) {

    const className = props?.className;
    const styleScheme = props?.style ?? ThemeService.getStyleScheme();
    const placeholder = props.placeholder ?? props.model?.placeholder;
    const label = props.label ?? props.model?.label ?? '';

    const values = useUserSelectFieldItemList( props?.values );

    const {
        fieldState,
        inputRef,
        currentItemLabel,
        currentItemIndex,
        selectItemCallback,
        onFocusCallback,
        onBlurCallback,
        onChangeCallback,
        onKeyDownCallback,
        dropdownOpen,
        buttonRefs
    } = useSelectField<any>(
        label,
        props?.model?.key ?? '',
        props?.change,
        props?.changeState,
        props?.value,
        values,
        props?.model?.required ?? false,
        CLOSE_DROPDOWN_TIMEOUT_ON_BLUR,
        MOVE_TO_ITEM_ON_OPEN_DROPDOWN_TIMEOUT
    );

    return (
        <SelectTemplate
            className={
                COMPONENT_CLASS_NAME
                + (className ? ` ${className}` : '')
            }
            style={styleScheme}
            placeholder={placeholder}
            values={values}
            fieldState={fieldState}
            inputRef={inputRef}
            label={label}
            currentItemLabel={currentItemLabel}
            currentItemIndex={currentItemIndex}
            selectItemCallback={selectItemCallback}
            onFocusCallback={onFocusCallback}
            onBlurCallback={onBlurCallback}
            onChangeCallback={onChangeCallback}
            onKeyDownCallback={onKeyDownCallback}
            dropdownOpen={dropdownOpen}
            buttonRefs={buttonRefs}
        />
    );

}
