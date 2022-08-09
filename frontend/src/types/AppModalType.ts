// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export enum AppModalType {

    NEW_WORKSPACE_MODAL = "NEW_WORKSPACE_MODAL",
    EDIT_WORKSPACE_MODAL = "EDIT_WORKSPACE_MODAL",

    NEW_USER_MODAL = "NEW_USER_MODAL",
    EDIT_USER_MODAL = "EDIT_USER_MODAL",

}

export function isAppModalType (value: any): value is AppModalType {
    switch (value) {
        case AppModalType.NEW_WORKSPACE_MODAL:
        case AppModalType.EDIT_WORKSPACE_MODAL:
        case AppModalType.NEW_USER_MODAL:
        case AppModalType.EDIT_USER_MODAL:
            return true;

        default:
            return false;

    }
}

export function stringifyAppModalType (value: AppModalType): string {
    switch (value) {
        case AppModalType.NEW_WORKSPACE_MODAL     : return 'NEW_WORKSPACE_MODAL';
        case AppModalType.EDIT_WORKSPACE_MODAL     : return 'EDIT_WORKSPACE_MODAL';
        case AppModalType.NEW_USER_MODAL     : return 'NEW_USER_MODAL';
        case AppModalType.EDIT_USER_MODAL     : return 'EDIT_USER_MODAL';
    }
    throw new TypeError(`AppModalType: Unsupported value: ${value}`);
}

export function parseAppModalType (value: any): AppModalType | undefined {
    switch (`${value}`.toUpperCase()) {
        case 'NEW_WORKSPACE_MODAL' : return AppModalType.NEW_WORKSPACE_MODAL;
        case 'EDIT_WORKSPACE_MODAL' : return AppModalType.EDIT_WORKSPACE_MODAL;
        case 'NEW_USER_MODAL' : return AppModalType.NEW_USER_MODAL;
        case 'EDIT_USER_MODAL' : return AppModalType.EDIT_USER_MODAL;
        default     : return undefined;
    }
}
