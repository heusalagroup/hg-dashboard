// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { NoneMainLayout } from "./main/NoneMainLayout";
import { NoneLoginLayout } from "./login/NoneLoginLayout";
import { NoneProfileLayout } from "./profile/NoneProfileLayout";
import { DashboardLayout } from "../../types/DashboardLayout";
import { NoneWorkspaceLayout } from "./workspace/NoneWorkspaceLayout";

export const dashboardLayout : DashboardLayout = {
    main: NoneMainLayout,
    login: NoneLoginLayout,
    profile: NoneProfileLayout,
    workspace: NoneWorkspaceLayout
};
