// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

export const INDEX_ROUTE = '/';
export const NOT_FOUND_ROUTE = '/';
export const LOGIN_INDEX_ROUTE = '/';

export const MY_INDEX_ROUTE = '/my';
export const MY_PROFILE_INDEX_ROUTE = '/my/profile';
export const MY_WORKSPACE_LIST_ROUTE = '/my/workspaces';

export const WORKSPACE_INDEX_ROUTE = '/workspace';
export const ABOUT_ROUTE = '/workspace/:parentId/about'; //about
export const USER_LIST_ROUTE = '/workspace/:parentId/users';
export const USER_ROUTE = '/workspace/:parentId/users/:id';
export const getUserRoute = (c: string, d:string) => `/workspace/${q(c)}/users/${q(d)}`;
export const getWorkspaceUserListRoute = (workspaceId: string) => `/workspace/${q(workspaceId)}/users`;
export const getWorkspaceRoute = (c: string) => `/workspace/${q(c)}`;
export const getWorkspaceAboutRoute = (c: string) => `/workspace/${q(c)}/about`;

function q(value: string): string {
    return encodeURIComponent(value);
}
