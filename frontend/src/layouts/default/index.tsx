// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DefaultMainLayout } from "./main/DefaultMainLayout";
import { DefaultLoginLayout } from "./login/DefaultLoginLayout";
import { DefaultProfileLayout } from "./profile/DefaultProfileLayout";
import { DashboardLayout } from "../../types/DashboardLayout";
import { DefaultWorkspaceLayout } from "./workspace/DefaultWorkspaceLayout";

export const dashboardLayout : DashboardLayout = {
    main: DefaultMainLayout,
    login: DefaultLoginLayout,
    profile: DefaultProfileLayout,
    workspace: DefaultWorkspaceLayout
};
