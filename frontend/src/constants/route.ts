// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export const INDEX_ROUTE = '/';
export const NOT_FOUND_ROUTE = '/';
export const LOGIN_INDEX_ROUTE = '/';

export const ABOUT_ROUTE = '/about';

export const PROFILE_INDEX_ROUTE = '/my/profile';

export const WORKSPACE_LIST_ROUTE = '/workspaces';

export const USER_LIST_ROUTE = '/users';
export const USER_ROUTE = '/users/:id';
export const getUserRoute = (c: string) => `/users/${q(c)}`;

function q(value: string): string {
    return encodeURIComponent(value);
}
