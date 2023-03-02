// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.

import {
    DASHBOARD_API_AUTHENTICATE_EMAIL_PATH,
    DASHBOARD_API_GET_MY_WORKSPACE_LIST_PATH,
    DASHBOARD_API_VERIFY_EMAIL_CODE_PATH,
    DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH,
    DASHBOARD_API_GET_MY_PROFILE_PATH,
    DASHBOARD_API_INDEX_PATH,
    DASHBOARD_API_POST_MY_WORKSPACE_PATH,
    DASHBOARD_API_DELETE_MY_WORKSPACE_LIST_PATH,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_PATH,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_WORKSPACE_ID,
    DASHBOARD_API_POST_MY_WORKSPACE_USER_PATH,
    DASHBOARD_API_POST_MY_WORKSPACE_USER_WORKSPACE_ID,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_PATH,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_WORKSPACE_ID,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_USER_ID,
    DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_WORKSPACE_ID,
    DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_PATH,
    DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_USER_ID,
    VALID_ADMIN_DOMAINS,
    DASHBOARD_API_GET_MY_WORKSPACE_USER_BY_PROFILE_PATH
} from "../fi/hg/dashboard/constants/dashboard-api";

import {
    DeleteMapping,
    GetMapping,
    PathVariable,
    PostMapping,
    RequestBody,
    RequestHeader,
    RequestMapping,
    RequestParam
} from "../fi/hg/core/Request";
import { ReadonlyJsonObject } from "../fi/hg/core/Json";
import { ResponseEntity } from "../fi/hg/core/request/ResponseEntity";
import { LogService } from "../fi/hg/core/LogService";
import { createErrorDTO, ErrorDTO } from "../fi/hg/core/types/ErrorDTO";
import { EmailTokenService } from "../fi/hg/backend/EmailTokenService";
import { createProfileDTO, ProfileDTO } from "../fi/hg/dashboard/types/dto/ProfileDTO";
import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { RequestParamValueType } from "../fi/hg/core/request/types/RequestParamValueType";
import { DashboardQueryParam } from "../fi/hg/dashboard/types/DashboardQueryParam";
import { filter } from "../fi/hg/core/functions/filter";
import { map } from "../fi/hg/core/functions/map";
import { trim } from "../fi/hg/core/functions/trim";
import { uniq } from "../fi/hg/core/functions/uniq";
import { EmailAuthController } from "../fi/hg/backend/EmailAuthController";
import { DashboardBackendService } from "../services/DashboardBackendService";
import { IndexDTO } from "../fi/hg/dashboard/types/dto/IndexDTO";
import { createWorkspaceListDTO, WorkspaceListDTO } from "../fi/hg/dashboard/types/dto/WorkspaceListDTO";
import { isPartialWorkspace } from "../fi/hg/dashboard/types/Workspace";
import { LogLevel } from "../fi/hg/core/types/LogLevel";
import { createUserListDTO, UserListDTO } from "../fi/hg/dashboard/types/dto/UserListDTO";
import { createUser, isPartialUser, isUser, User } from "../fi/hg/dashboard/types/User";
import { createNewWorkspaceDTO, NewWorkspaceDTO } from "../fi/hg/dashboard/types/dto/NewWorkspaceDTO";
import { EmailUtils } from "../fi/hg/core/EmailUtils";
import { isAuthenticateEmailDTO } from "../fi/hg/core/auth/email/types/AuthenticateEmailDTO";
import { JwtService } from "../fi/hg/backend/JwtService";
import { DASHBOARD_AUTHORIZATION_HEADER_NAME } from "../fi/hg/dashboard/constants/dashboard-headers";

const LOG = LogService.createLogger('DashboardBackendController');

@RequestMapping("/")
export class DashboardBackendController {

    private static _backend: DashboardBackendService;
    private static _emailTokenService : EmailTokenService;
    private static _emailAuthController : EmailAuthController;

    public static setBackendService (service: DashboardBackendService): void {
        this._backend = service;
    }

    public static setEmailTokenService (service: EmailTokenService): void {
        this._emailTokenService = service;
    }

    public static setEmailAuthController (service: EmailAuthController): void {
        this._emailAuthController = service;
    }

    public static setLogLevel (level: LogLevel) {
        LOG.setLogLevel(level);
    }


    // *********** INDEX ***********

    /**
     * Returns API index resource
     *
     * @param token
     */
    @GetMapping(DASHBOARD_API_INDEX_PATH)
    public static async getIndex (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: false,
            defaultValue: ''
        })
            token: string
    ): Promise<ResponseEntity<IndexDTO | {readonly error: string}>> {
        try {

            return ResponseEntity.ok(
                {
                    hello: 'world'
                } as IndexDTO
            );

        } catch (err) {
            LOG.error(`ERROR: `, err);
            return ResponseEntity.internalServerError<{readonly error: string}>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }


    // *********** PROFILE ***********

    /**
     * Returns profile data
     *
     * @param token
     */
    @GetMapping(DASHBOARD_API_GET_MY_PROFILE_PATH)
    public static getMyProfile (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string
    ): ResponseEntity<ProfileDTO | ErrorDTO> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided.`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const email: string = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(createErrorDTO('Access denied', 403));
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getAuctionList: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(createErrorDTO('Access denied', 403));
            }

            return ResponseEntity.ok(createProfileDTO(email));

        } catch (err) {
            LOG.error(`ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    // *********** WORSKPACE USER PROFILE ***********

    /**
     * Returns profile for a workspace
     *
     * @param token
     * @param parentIdString
     */
    @GetMapping(DASHBOARD_API_GET_MY_WORKSPACE_USER_BY_PROFILE_PATH)
    public static async getMyWorkspaceUserByProfile(
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @PathVariable(DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_WORKSPACE_ID, {required: true})
            parentIdString: string
    ): Promise<User | ResponseEntity<ErrorDTO>> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided.`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const workspaceId: string = trim(parentIdString ?? '');
            LOG.debug(`getMyWorkspaceUserList: workspaceId: `, workspaceId);

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getMyWorkspaceUserList: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const userList: User[] = await this._backend.getUserListForWorkspace(workspaceId);

            const profiles: User[] = userList.filter(user => user.email === email);

            return profiles[0];

        } catch (err) {
            LOG.error(`getMyWorkspaceUserList: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }


    // *********** WORKSPACES ***********

    /**
     * Workspace creation
     *
     * @param token
     * @param body
     */
    @PostMapping(DASHBOARD_API_POST_MY_WORKSPACE_PATH)
    public static async createWorkspace (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @RequestBody
            body: ReadonlyJsonObject
    ): Promise<ResponseEntity<NewWorkspaceDTO | ErrorDTO>> {
        try {

            if ( !isPartialWorkspace(body) ) {
                LOG.debug(`createWorkspace: Not Partial<Workspace> body: `, body);
                return ResponseEntity.badRequest<ErrorDTO>().body(
                    createErrorDTO('Bad Request', 400)
                );
            }

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided in createWorkspace`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address in createWorkspace.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !VALID_ADMIN_DOMAINS.includes(EmailUtils.getEmailDomain(email)) ) {
                LOG.warn(`Warning! Email address not accepted to create workspaces: `, email);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`createWorkspace: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const item = await this._backend.createWorkspace(body.name);

            const workspaceId = item?.id;

            const user = await this._backend.createUser(
                createUser(
                    workspaceId,
                    'new',
                    `${email}`.replace(/@.*$/g, ""),
                    email
                )
            );

            const dto = createNewWorkspaceDTO(
                item,
                [ user ]
            );

            LOG.debug(`createWorkspace: `, body.name, body?.categories, dto);

            return ResponseEntity.ok<NewWorkspaceDTO>(
                createNewWorkspaceDTO(
                    item,
                    [ user ]
                )
            );

        } catch (err) {
            LOG.error(`createWorkspace: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * Workspace deletion (all of them)
     *
     * @param token
     */
    @DeleteMapping(DASHBOARD_API_DELETE_MY_WORKSPACE_LIST_PATH)
    public static async deleteWorkspaces (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string
    ): Promise<ResponseEntity<void | ErrorDTO>> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided in deleteWorkspaces`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address in deleteWorkspaces.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`deleteWorkspaces: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const users = await this._backend.getUserListByEmail(email);
            const workspaceIdList: string[] = uniq(map(users, (user: User) => user?.workspaceId));
            await this._backend.deleteSomeWorkspaces(workspaceIdList);

        } catch (err) {
            LOG.error(`deleteWorkspaces: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * Returns a list of workspaces
     *
     * @param token
     * @param idListString
     */
    @GetMapping(DASHBOARD_API_GET_MY_WORKSPACE_LIST_PATH)
    public static async getMyWorkspaceList (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @RequestParam(DashboardQueryParam.ID_LIST, RequestParamValueType.STRING)
            idListString = ""
    ): Promise<WorkspaceListDTO | ResponseEntity<ErrorDTO>> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided.`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const idList: readonly string[] | undefined = idListString ? (`${idListString ?? ''}`).split(' ').map(trim) : undefined;

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getMyWorkspaceList: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const users = await this._backend.getUserListByEmail(email);
            const userWorkspaceIdList : readonly string[] = uniq(map(users, (user: User) : string => user?.workspaceId));
            const fullIdList: readonly string[] = idList ? filter(
                userWorkspaceIdList,
                (id: string) : boolean => idList.includes(id)
            ) : userWorkspaceIdList;

            return createWorkspaceListDTO(
                await this._backend.getSomeWorkspaceList(fullIdList)
            );

        } catch (err) {
            LOG.error(`getMyWorkspaceList: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }


    // *********** USERS ***********

    /**
     * Returns user list for a workspace
     *
     * @param token
     * @param parentIdString
     */
    @GetMapping(DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_PATH)
    public static async getMyWorkspaceUserList (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @PathVariable(DASHBOARD_API_GET_MY_WORKSPACE_USER_LIST_WORKSPACE_ID, {required: true})
            parentIdString: string
    ): Promise<UserListDTO | ResponseEntity<ErrorDTO>> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided.`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const workspaceId: string = trim(parentIdString ?? '');
            LOG.debug(`getMyWorkspaceUserList: workspaceId: `, workspaceId);

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getMyWorkspaceUserList: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const list: User[] = await this._backend.getUserListForWorkspace(workspaceId);

            return createUserListDTO(list);

        } catch (err) {
            LOG.error(`getMyWorkspaceUserList: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * User creation
     *
     * @param token
     * @param parentIdString
     * @param body
     */
    @PostMapping(DASHBOARD_API_POST_MY_WORKSPACE_USER_PATH)
    public static async createUser (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @PathVariable(DASHBOARD_API_POST_MY_WORKSPACE_USER_WORKSPACE_ID, {required: true})
            parentIdString: string,
        @RequestBody
            body: ReadonlyJsonObject
    ): Promise<User | ResponseEntity<ErrorDTO>> {
        try {

            if ( !isUser(body) ) {
                LOG.debug(`createUser: Body not User: `, body);
                return ResponseEntity.badRequest<ErrorDTO>().body(
                    createErrorDTO('Bad Request', 400)
                );
            }

            const workspaceId: string = trim(parentIdString ?? '');
            LOG.debug(`createUser: workspaceId: `, workspaceId);

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided in createUser`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address in createUser.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`createUser: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const newUserModel: User = {
                ...body,
                id: 'new',
                workspaceId
            };
            LOG.debug(`createUser: newUserModel= `, newUserModel, body);

            const item = await this._backend.createUser(newUserModel);
            LOG.debug(`createUser: item= `, item);
            return item;

        } catch (err) {
            LOG.error(`createUser: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * Returns a user by ID
     *
     * @param token
     * @param parentIdString
     * @param idString
     */
    @GetMapping(DASHBOARD_API_GET_MY_WORKSPACE_USER_PATH)
    public static async getMyUserById (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @PathVariable(DASHBOARD_API_GET_MY_WORKSPACE_USER_WORKSPACE_ID, {required: true})
            parentIdString = "",
        @PathVariable(DASHBOARD_API_GET_MY_WORKSPACE_USER_USER_ID, {required: true})
            idString = ""
    ): Promise<User | ResponseEntity<ErrorDTO>> {
        try {

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided in getMyUserById.`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const workspaceId: string = trim(parentIdString ?? '');
            const userId: string = trim(idString ?? '');

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address in getMyUserById.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`getMyUserById: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const result = await this._backend.getUserForWorkspace(workspaceId, userId);
            if ( !result ) {
                return ResponseEntity.notFound<ErrorDTO>().body(
                    createErrorDTO('Not Found', 404)
                );
            }
            return result;

        } catch (err) {
            LOG.error(`getMyUserById: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    /**
     * Updates a user by ID
     *
     * @param token
     * @param parentIdString
     * @param idString
     * @param body
     */
    @PostMapping(DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_PATH)
    public static async updateMyUserById (
        @RequestHeader(DASHBOARD_AUTHORIZATION_HEADER_NAME, {
            required: true
        })
            token: string,
        @PathVariable(DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_WORKSPACE_ID, {required: true})
            parentIdString: string,
        @PathVariable(DASHBOARD_API_UPDATE_MY_WORKSPACE_USER_USER_ID, {required: true})
            idString: string,
        @RequestBody
            body: ReadonlyJsonObject
    ): Promise<User | ResponseEntity<ErrorDTO>> {
        try {

            if ( !isPartialUser(body) ) {
                LOG.debug(`updateMyUserById: Not Partial<User> body: `, body);
                return ResponseEntity.badRequest<ErrorDTO>().body(
                    createErrorDTO('Bad Request', 400)
                );
            }

            if ( !token ) {
                LOG.warn(`Warning! No authentication token provided in updateMyUserById`);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const workspaceId: string = trim(parentIdString ?? '');
            LOG.debug(`updateMyUserById: workspaceId: `, workspaceId);

            const userId: string = trim(idString ?? '');
            LOG.debug(`updateMyUserById: userId: `, userId);

            const email: string | undefined = JwtService.decodePayloadSubject(token);
            if ( !email ) {
                LOG.warn(`Warning! Token did not have an email address in updateMyUserById.`, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            if ( !this._emailTokenService.verifyToken(email, token, true) ) {
                LOG.debug(`updateMyUserById: Access denied for email: `, email, token);
                return ResponseEntity.internalServerError<ErrorDTO>().body(
                    createErrorDTO('Access denied', 403)
                );
            }

            const result = await this._backend.getUserForWorkspace(workspaceId, userId);
            if ( !result ) {
                return ResponseEntity.notFound<ErrorDTO>().body(
                    createErrorDTO('Not Found', 404)
                );
            }

            LOG.debug(`updateMyUserById: `, workspaceId, userId, body);

            return await this._backend.updateUserForWorkspace(
                workspaceId,
                userId,
                body
            );

        } catch (err) {
            LOG.error(`updateMyUserById: ERROR: `, err);
            return ResponseEntity.internalServerError<ErrorDTO>().body(
                createErrorDTO('Internal Server Error', 500)
            );
        }
    }

    // *********** AUTHENTICATION ***********

    /**
     * Initiates an authentication using email address
     *
     * @param body
     * @param langString
     */
    @PostMapping(DASHBOARD_API_AUTHENTICATE_EMAIL_PATH)
    public static async authenticateEmail (
        @RequestBody
            body: ReadonlyJsonObject,
        @RequestParam(DashboardQueryParam.LANGUAGE, RequestParamValueType.STRING)
            langString = ""
    ): Promise<ResponseEntity<EmailTokenDTO | ErrorDTO>> {

        if ( !isAuthenticateEmailDTO(body) ) {
            return ResponseEntity.badRequest<ErrorDTO>().body(
                createErrorDTO(`Body not AuthenticateEmailDTO`, 400)
            ).status(400);
        }

        const email = body.email;

        if ( !VALID_ADMIN_DOMAINS.includes(EmailUtils.getEmailDomain(email)) ) {
            const users = await this._backend.getUserListByEmail(email);
            if ( (users?.length ?? 0) === 0 ) {
                LOG.debug(`Email address not registered: "${email}"`);
                return ResponseEntity.badRequest<ErrorDTO>().body(
                    createErrorDTO(`Access denied`, 403)
                ).status(403);
            }
        }

        return await this._emailAuthController.authenticateEmail(body, langString);
    }

    /**
     * Verifies an session token
     *
     * @param body
     */
    @PostMapping(DASHBOARD_API_VERIFY_EMAIL_TOKEN_PATH)
    public static async verifyEmailToken (
        @RequestBody
            body: ReadonlyJsonObject
    ): Promise<ResponseEntity<EmailTokenDTO | ErrorDTO>> {
        LOG.debug('verifyEmailToken');
        return this._emailAuthController.verifyEmailToken(body);
    }

    /**
     * Verifies an email address using a code provided by `.authenticateEmail()`
     *
     * @param body
     */
    @PostMapping(DASHBOARD_API_VERIFY_EMAIL_CODE_PATH)
    public static async verifyEmailCode (
        @RequestBody
            body: ReadonlyJsonObject
    ): Promise<ResponseEntity<EmailTokenDTO | ErrorDTO>> {
        LOG.debug('verifyEmailCode');
        return this._emailAuthController.verifyEmailCode(body);
    }

}
