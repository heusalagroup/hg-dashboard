// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { LogService } from "../fi/hg/core/LogService";
import { WorkspaceService } from "./WorkspaceService";

const LOG = LogService.createLogger('AppInitService');

export class AppInitService {

    public static initialize () {
        try {
            LOG.debug(`Initializing app...`);
            WorkspaceService.initialize();
            LOG.info(`App initialized.`);
        } catch (err) {
            LOG.error(`Error while initializing: `, err);
        }
    }

}
