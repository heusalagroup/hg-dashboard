// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DarkMainLayout } from "./main/DarkMainLayout";
import { DarkLoginLayout } from "./login/DarkLoginLayout";
import { DarkProfileLayout } from "./profile/DarkProfileLayout";
import { DashboardLayout } from "../../types/DashboardLayout";
import "./dark-index.scss";

export const dashboardLayout : DashboardLayout = {
    main: DarkMainLayout,
    login: DarkLoginLayout,
    profile: DarkProfileLayout
};
