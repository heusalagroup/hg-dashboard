// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export enum ModalState {
    UNAUTHENTICATED,
    AUTHENTICATING,
    VERIFYING_CODE,
    AUTHENTICATED,
    SUBMIT_SUCCESS,
    SUBMIT_ERROR
}
