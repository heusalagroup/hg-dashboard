// Copyright (c) 2023. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    Navigate,
    Outlet,
    useRoutes
} from "react-router-dom";
import {
    LOGIN_INDEX_ROUTE,
    MY_PROFILE_INDEX_ROUTE,
    NOT_FOUND_ROUTE,
    USER_LIST_ROUTE,
    USER_ROUTE,
    ABOUT_ROUTE,
    MY_WORKSPACE_LIST_ROUTE, MY_INDEX_ROUTE, WORKSPACE_INDEX_ROUTE
} from "../../constants/route";
import { LogService } from "../../fi/hg/core/LogService";
import { useEmailAuthSession } from "../../fi/hg/frontend/hooks/useEmailAuthSession";
import { ProfileView } from "../views/profile/ProfileView";
import { LoginView } from "../views/login/LoginView";
import { AboutView } from "../views/about/AboutView";
import { DARK_MAIN_LAYOUT_CLASS_NAME, DASHBOARD_APP_CLASS_NAME } from "../../constants/appClassName";
import { useLanguageService } from "../../fi/hg/frontend/hooks/useLanguageService";
import { UserListView } from "../views/user/list/UserListView";
import { WorkspaceListView } from "../views/workspace/list/WorkspaceListView";
import { useRouteServiceWithNavigate } from "../../fi/hg/frontend/hooks/useRouteServiceWithNavigate";
import { LayoutComponent } from "../../types/DashboardLayout";
import { useAppModal } from "../../hooks/modal/useAppModal";
import { AppModalContainer } from "../common/layout/appModalContainer/AppModalContainer";
import {EditUserModal} from "../modals/user/editUserModal/EditUserModal";
import "./DashboardApp.scss";

const LOG = LogService.createLogger('DashboardApp');

export interface DashboardAppProps {
    readonly mainLayout : LayoutComponent;
    readonly loginLayout : LayoutComponent;
    readonly profileLayout : LayoutComponent;
    readonly workspaceLayout : LayoutComponent;
}

export function DashboardApp (
    props: DashboardAppProps
) {

    const MainLayout = props.mainLayout;
    const LoginLayout = props.loginLayout;
    const ProfileLayout = props.profileLayout;
    const WorkspaceLayout = props.workspaceLayout;

    const {isLoggedIn} = useEmailAuthSession();
    LOG.debug("isLoggedIn: ", isLoggedIn);

    useRouteServiceWithNavigate();

    const {t} = useLanguageService();

    const modal = useAppModal();

    const modalContainer = (
        <AppModalContainer
            className={`${DARK_MAIN_LAYOUT_CLASS_NAME}-content-modals`}
            t={t}
            modal={modal}
        />
    );

    const loginRoutes = {
        path: LOGIN_INDEX_ROUTE,
        element: (
            <LoginLayout t={t}>
                <Outlet />
                {modalContainer}
            </LoginLayout>
        ),
        children: [
            {path: LOGIN_INDEX_ROUTE, element: <LoginView t={t} />},
            {path: '*', element: <Navigate to={LOGIN_INDEX_ROUTE} />},
            {path: NOT_FOUND_ROUTE, element: <Navigate to={LOGIN_INDEX_ROUTE} />}
        ]
    };

    const mainRoutes = {
        path: WORKSPACE_INDEX_ROUTE,
        element: (
            <MainLayout t={t}>
                <WorkspaceLayout t={t}>
                    <Outlet />
                </WorkspaceLayout>
                {modalContainer}
            </MainLayout>
        ),
        children: [
            {path: ABOUT_ROUTE, element: <AboutView t={t} />},
            {path: USER_LIST_ROUTE, element: <UserListView t={t} />,
                children:[
                    {path:USER_ROUTE, element: <EditUserModal t={t} />}
                ]},
            {path: WORKSPACE_INDEX_ROUTE, element: <Navigate to={MY_WORKSPACE_LIST_ROUTE} />}
        ]
    };

    const profileRoutes = {
        path: MY_INDEX_ROUTE,
        element: (
            <MainLayout t={t}>
                <ProfileLayout t={t}>
                    <Outlet />
                </ProfileLayout>
                {modalContainer}
            </MainLayout>
        ),
        children: [
            {path: MY_WORKSPACE_LIST_ROUTE, element: <WorkspaceListView t={t} />},
            {path: MY_PROFILE_INDEX_ROUTE, element: <ProfileView t={t} />},
            {path: '*', element: <Navigate to={ABOUT_ROUTE} />},
            {path: MY_INDEX_ROUTE, element: <Navigate to={WORKSPACE_INDEX_ROUTE} />}
        ]
    };

    const main = useRoutes(
        [
            mainRoutes,
            profileRoutes
        ]
    );

    const login = useRoutes(
        [
            loginRoutes
        ]
    );


    return <div className={DASHBOARD_APP_CLASS_NAME}>
        { isLoggedIn ? main : login}
    </div>;

}
