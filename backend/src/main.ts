// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.

import { ProcessUtils } from "./fi/hg/core/ProcessUtils";
import {
    BACKEND_DEFAULT_LANGUAGE,
    BACKEND_EMAIL_CONFIG,
    BACKEND_EMAIL_FROM,
    BACKEND_IO_SERVER,
    BACKEND_JWT_ALG,
    BACKEND_JWT_SECRET,
    BACKEND_LOG_LEVEL,
    BACKEND_SCRIPT_NAME,
    BACKEND_URL
} from "./constants/runtime";

import { LogService } from "./fi/hg/core/LogService";
import { LogLevel } from "./fi/hg/core/types/LogLevel";
import { CommandExitStatus } from "./fi/hg/core/cmd/types/CommandExitStatus";
import { RequestClient } from "./fi/hg/core/RequestClient";
import { CommandArgumentUtils } from "./fi/hg/core/cmd/utils/CommandArgumentUtils";
import { ParsedCommandArgumentStatus } from "./fi/hg/core/cmd/types/ParsedCommandArgumentStatus";
import { RequestServer } from "./fi/hg/node/RequestServer";
import { DashboardBackendController } from "./controllers/DashboardBackendController";
import { RequestRouter } from "./fi/hg/node/requestServer/RequestRouter";
import { Headers } from "./fi/hg/core/request/Headers";
import { BUILD_USAGE_URL, BUILD_WITH_FULL_USAGE } from "./constants/build";
import { EmailTokenService } from "./fi/hg/backend/EmailTokenService";
import { JwtService } from "./fi/hg/backend/JwtService";
import { BackendTranslationService } from "./fi/hg/backend/BackendTranslationService";
import { DEFAULT_LANGUAGE } from "./fi/hg/core/auth/email/translation";
import { TRANSLATIONS } from "./fi/hg/core/auth/email/translations";
import { EmailService } from "./fi/hg/backend/EmailService";
import { DashboardBackendService } from "./services/DashboardBackendService";
import { WorkspaceRepositoryService } from "./fi/hg/dashboard/services/WorkspaceRepositoryService";
import { MatrixCrudRepository } from "./fi/hg/matrix/MatrixCrudRepository";
import { SimpleMatrixClient } from "./fi/hg/matrix/SimpleMatrixClient";
import { MatrixSharedClientService } from "./fi/hg/matrix/MatrixSharedClientService";
import { UserRepositoryService } from "./fi/hg/dashboard/services/UserRepositoryService";
import { MatrixRepositoryInitializer } from "./fi/hg/matrix/MatrixRepositoryInitializer";
import {
    DASHBOARD_USER_ROOM_TYPE,
    DASHBOARD_WORKSPACE_ROOM_TYPE
} from "./constants/repository";
import { isStoredWorkspaceRepositoryItem,
    StoredWorkspaceRepositoryItem } from "./fi/hg/dashboard/types/repository/workspace/StoredWorkspaceRepositoryItem";
import { isStoredUserRepositoryItem,
    StoredUserRepositoryItem } from "./fi/hg/dashboard/types/repository/user/StoredUserRepositoryItem";
import { RepositoryType } from "./fi/hg/core/simpleRepository/types/RepositoryType";
import { startsWith } from "./fi/hg/core/functions/startsWith";
import { StoredRepositoryItem, StoredRepositoryItemTestCallback } from "./fi/hg/core/simpleRepository/types/StoredRepositoryItem";
import { MemoryRepositoryInitializer } from "./fi/hg/core/simpleRepository/MemoryRepositoryInitializer";
import { MemorySharedClientService } from "./fi/hg/core/simpleRepository/MemorySharedClientService";
import { EmailAuthController } from "./fi/hg/backend/EmailAuthController";
import { EmailVerificationService } from "./fi/hg/backend/EmailVerificationService";
import { EmailAuthMessageService } from "./fi/hg/backend/EmailAuthMessageService";
import { parseLanguage } from "./fi/hg/core/types/Language";
import { HgNode } from "./fi/hg/node/HgNode";

// Must be first import to define environment variables before anything else
ProcessUtils.initEnvFromDefaultFiles();

LogService.setLogLevel(BACKEND_LOG_LEVEL);

const LOG = LogService.createLogger('main');
LOG.setLogLevel(BACKEND_LOG_LEVEL);

export async function main (
    args: string[] = []
) : Promise<CommandExitStatus> {

    try {

        HgNode.initialize();

        Headers.setLogLevel(LogLevel.INFO);
        RequestRouter.setLogLevel(LogLevel.INFO);
        RequestClient.setLogLevel(LogLevel.INFO);
        RequestServer.setLogLevel(LogLevel.INFO);
        EmailTokenService.setLogLevel(BACKEND_LOG_LEVEL);
        MatrixCrudRepository.setLogLevel(BACKEND_LOG_LEVEL);
        SimpleMatrixClient.setLogLevel(BACKEND_LOG_LEVEL);
        DashboardBackendController.setLogLevel(BACKEND_LOG_LEVEL);

        LOG.debug(`Loglevel as ${LogService.getLogLevelString()}`);

        const jwtService = new JwtService();

        const jwtEngine = jwtService.createJwtEngine(BACKEND_JWT_SECRET, BACKEND_JWT_ALG);

        const emailTokenService = new EmailTokenService(
            jwtEngine
        );

        const emailService = new EmailService(
            BACKEND_EMAIL_FROM
        );

        const {scriptName, parseStatus, exitStatus, errorString} = CommandArgumentUtils.parseArguments(BACKEND_SCRIPT_NAME, args);

        if ( parseStatus === ParsedCommandArgumentStatus.HELP || parseStatus === ParsedCommandArgumentStatus.VERSION ) {
            console.log(getMainUsage(scriptName));
            return exitStatus;
        }

        if (errorString) {
            console.error(`ERROR: ${errorString}`);
            return exitStatus;
        }

        await BackendTranslationService.initialize(DEFAULT_LANGUAGE, TRANSLATIONS);

        emailService.initialize(BACKEND_EMAIL_CONFIG);

        const repositoryType : RepositoryType = startsWith(BACKEND_IO_SERVER, 'memory:') ? RepositoryType.MEMORY : RepositoryType.MATRIX;

        const matrixSharedClientService = new MatrixSharedClientService();
        const memorySharedClientService = new MemorySharedClientService();

        // Workspace repository
        const workspaceRepositoryService = await constructRepository<StoredWorkspaceRepositoryItem>(
            repositoryType,
            isStoredWorkspaceRepositoryItem,
            DASHBOARD_WORKSPACE_ROOM_TYPE,
            matrixSharedClientService,
            memorySharedClientService,
            WorkspaceRepositoryService
        );

        // User repository
        const userRepositoryService = await constructRepository<StoredUserRepositoryItem>(
            repositoryType,
            isStoredUserRepositoryItem,
            DASHBOARD_USER_ROOM_TYPE,
            matrixSharedClientService,
            memorySharedClientService,
            UserRepositoryService
        );


        const backendService = new DashboardBackendService(
            workspaceRepositoryService,
            userRepositoryService
        );

        // Initialize repositories
        if (repositoryType === RepositoryType.MATRIX) {
            await matrixSharedClientService.initialize(BACKEND_IO_SERVER);
        }
        if (repositoryType === RepositoryType.MEMORY) {
            await memorySharedClientService.initialize(BACKEND_IO_SERVER);
        }
        await workspaceRepositoryService.initialize();
        await userRepositoryService.initialize();

        const emailVerificationService = new EmailVerificationService();

        const emailAuthMessageService = new EmailAuthMessageService(emailService);

        const emailAuthController = new EmailAuthController(
            parseLanguage(BACKEND_DEFAULT_LANGUAGE),
            emailTokenService,
            emailVerificationService,
            emailAuthMessageService
        );

        DashboardBackendController.setBackendService(backendService);
        DashboardBackendController.setEmailTokenService(emailTokenService);
        DashboardBackendController.setEmailAuthController(emailAuthController);

        const server = new RequestServer(BACKEND_URL);
        server.attachController(DashboardBackendController);
        server.start();

        let serverListener : any = undefined;

        const stopPromise = new Promise<void>((resolve, reject) => {
            try {
                LOG.debug('Stopping server from RequestServer stop event');
                serverListener = server.on(RequestServer.Event.STOPPED, () => {
                    serverListener = undefined;
                    resolve();
                });
            } catch(err) {
                reject(err);
            }
        });

        ProcessUtils.setupDestroyHandler( () => {

            LOG.debug('Stopping server from process utils event');

            server.stop();

            if (serverListener) {
                serverListener();
                serverListener = undefined;
            }

        }, (err : any) => {
            LOG.error('Error while shutting down the service: ', err);
        });

        await stopPromise;

        return CommandExitStatus.OK;

    } catch (err) {
        LOG.error(`Fatal error: `, err);
        return CommandExitStatus.FATAL_ERROR;
    }

}

/**
 *
 * @param scriptName
 * @nosideeffects
 * @__PURE__
 */
export function getMainUsage (
    scriptName: string
): string {

    /* @__PURE__ */if ( /* @__PURE__ */BUILD_WITH_FULL_USAGE ) {

        return `USAGE: ${/* @__PURE__ */scriptName} [OPT(s)] ARG(1) [...ARG(N)]

  HG Oy backend.
  
...and OPT is one of:

    -h --help          Print help
    -v --version       Print version
    --                 Disables option parsing

  Environment variables:

    BACKEND_LOG_LEVEL as one of:
    
      ALL
      DEBUG
      INFO
      WARN
      ERROR
      NONE
`;
    } else {
        return `USAGE: ${/* @__PURE__ */scriptName} ARG(1) [...ARG(N)]
See ${/* @__PURE__ */BUILD_USAGE_URL}
`;
    }
}

async function constructRepository<T extends StoredRepositoryItem> (
    repositoryType      : RepositoryType,
    isT                 : StoredRepositoryItemTestCallback,
    matrixRoomType      : string,
    matrixClientService : MatrixSharedClientService,
    memoryClientService : MemorySharedClientService,
    ItemRepositoryService : any
) : Promise<any> {

    if (repositoryType === RepositoryType.MATRIX) {
        const matrixRepositoryInitializer = new MatrixRepositoryInitializer<T>( matrixRoomType, isT );
        return new ItemRepositoryService(matrixClientService, matrixRepositoryInitializer);
    }

    if (repositoryType === RepositoryType.MEMORY) {
        const memoryRepositoryInitializer = new MemoryRepositoryInitializer<T>( isT );
        return new ItemRepositoryService(memoryClientService, memoryRepositoryInitializer);
    }

    throw new TypeError(`Repository type not supported: ${repositoryType}`);
}
