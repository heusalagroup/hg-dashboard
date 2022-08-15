// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { StrictMode } from 'react';
import { render } from 'react-dom';
import { DashboardApp } from './components/dashboardApp/DashboardApp';
import { reportWebVitals } from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AppInitService } from "./services/AppInitService";
import { dashboardLayout } from "./layouts/dark";
import "./i18n";
import './index.scss';

AppInitService.initialize();

render(
  <StrictMode>
    <BrowserRouter>
      <DashboardApp
        mainLayout={dashboardLayout.main}
        profileLayout={dashboardLayout.profile}
        loginLayout={dashboardLayout.login}
      />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

