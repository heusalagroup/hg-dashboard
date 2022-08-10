// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../fi/hg/core/LogService";
import { WorkspaceService } from "./WorkspaceService";
import { EmailAuthHttpService } from "../fi/hg/frontend/services/EmailAuthHttpService";
import { DASHBOARD_AUTHENTICATE_EMAIL_URL_WITH_LANGUAGE, DASHBOARD_VERIFY_EMAIL_CODE_URL_WITH_LANGUAGE, DASHBOARD_VERIFY_EMAIL_TOKEN_URL_WITH_LANGUAGE } from "../fi/hg/dashboard/constants/dashboard-api";

const LOG = LogService.createLogger('AppInitService');

export class AppInitService {

    public static initialize () {
        try {
            LOG.debug(`Initializing app...`);
            EmailAuthHttpService.initialize(
                (lang) => '/api' + DASHBOARD_AUTHENTICATE_EMAIL_URL_WITH_LANGUAGE(lang),
                (lang) => '/api' + DASHBOARD_VERIFY_EMAIL_CODE_URL_WITH_LANGUAGE(lang),
                (lang) => '/api' + DASHBOARD_VERIFY_EMAIL_TOKEN_URL_WITH_LANGUAGE(lang)
            );
            WorkspaceService.initialize();
            LOG.info(`App initialized.`);
        } catch (err) {
            LOG.error(`Error while initializing: `, err);
        }
    }

}
