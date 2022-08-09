// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    Navigate,
    Outlet,
    useRoutes
} from "react-router-dom";
import {
    INDEX_ROUTE,
    LOGIN_INDEX_ROUTE,
    PROFILE_INDEX_ROUTE,
    NOT_FOUND_ROUTE,
    USER_LIST_ROUTE,
    USER_ROUTE,
    ABOUT_ROUTE,
    WORKSPACE_LIST_ROUTE
} from "../../constants/route";
import { LogService } from "../../fi/hg/core/LogService";
import { useEmailAuthSession } from "../../fi/hg/frontend/hooks/useEmailAuthSession";
import { MainLayout } from "../layouts/main/MainLayout";
import { LoginLayout } from "../layouts/login/LoginLayout";
import { ProfileLayout } from "../layouts/profile/ProfileLayout";
import { ProfileView } from "../views/profile/ProfileView";
import { LoginView } from "../views/login/LoginView";
import { AboutView } from "../views/about/AboutView";
import { DASHBOARD_APP_CLASS_NAME } from "../../constants/appClassName";
import { useLanguageService } from "../../fi/hg/frontend/hooks/useLanguageService";
import { UserView } from "../views/user/item/UserView";
import { UserListView } from "../views/user/list/UserListView";
import { WorkspaceListView } from "../views/workspace/list/WorkspaceListView";
import { useRouteServiceWithNavigate } from "../../fi/hg/frontend/hooks/useRouteServiceWithNavigate";
import "./DashboardApp.scss";

const LOG = LogService.createLogger('DashboardApp');

export function DashboardApp () {

    const {isLoggedIn} = useEmailAuthSession();
    LOG.debug("isLoggedIn: ", isLoggedIn);

    useRouteServiceWithNavigate();

    const {t} = useLanguageService();

    const loginRoutes = {
        path: LOGIN_INDEX_ROUTE,
        element: (
            <LoginLayout t={t}>
                <Outlet />
            </LoginLayout>
        ),
        children: [
            {path: LOGIN_INDEX_ROUTE, element: <LoginView t={t} />},
            {path: '*', element: <Navigate to={LOGIN_INDEX_ROUTE} />},
            {path: NOT_FOUND_ROUTE, element: <Navigate to={LOGIN_INDEX_ROUTE} />}
        ]
    };

    const mainRoutes = {
        path: INDEX_ROUTE,
        element: (
            <MainLayout t={t}>
                <Outlet />
            </MainLayout>
        ),
        children: [
            {path: ABOUT_ROUTE, element: <AboutView t={t} />},
            {path: WORKSPACE_LIST_ROUTE, element: <WorkspaceListView t={t} />},
            {path: USER_LIST_ROUTE, element: <UserListView t={t} />},
            {path: USER_ROUTE, element: <UserView t={t} />},
            {path: '*', element: <Navigate to={ABOUT_ROUTE} />},
            {path: NOT_FOUND_ROUTE, element: <Navigate to={ABOUT_ROUTE} />}
        ]
    };

    const profileRoutes = {
        path: PROFILE_INDEX_ROUTE,
        element: (
            <MainLayout t={t}>
                <ProfileLayout t={t}>
                    <Outlet />
                </ProfileLayout>
            </MainLayout>
        ),
        children: [
            {path: PROFILE_INDEX_ROUTE, element: <ProfileView t={t} />}
        ]
    };

    const main = useRoutes(
        [
            mainRoutes
            , profileRoutes
        ]
    );

    const login = useRoutes(
        [
            loginRoutes
        ]
    );

    return <div className={DASHBOARD_APP_CLASS_NAME}>{ isLoggedIn ? main : login}</div>;

}
