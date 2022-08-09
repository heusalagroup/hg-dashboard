// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { map } from "../fi/hg/core/modules/lodash";
import { WorkspaceRepositoryService } from "../fi/hg/dashboard/services/WorkspaceRepositoryService";
import { LogService } from "../fi/hg/core/LogService";
import { UserRepositoryService } from "../fi/hg/dashboard/services/UserRepositoryService";
import { createWorkspace, Workspace } from "../fi/hg/dashboard/types/Workspace";
import { createWorkspaceRepositoryItem, WorkspaceRepositoryItem } from "../fi/hg/dashboard/types/repository/workspace/WorkspaceRepositoryItem";
import { createUserRepositoryItem, UserRepositoryItem } from "../fi/hg/dashboard/types/repository/user/UserRepositoryItem";
import { User, createUser } from "../fi/hg/dashboard/types/User";

const LOG = LogService.createLogger('DashboardBackendService');

export class DashboardBackendService {

    private readonly _workspaceRepository : WorkspaceRepositoryService;
    private readonly _userRepository      : UserRepositoryService;

    public constructor (
        workspaceRepository : WorkspaceRepositoryService,
        userRepository      : UserRepositoryService
    ) {
        this._workspaceRepository = workspaceRepository;
        this._userRepository = userRepository;
    }


    // ****************** WORKSPACES ******************

    /**
     * Create new workspace
     *
     * @param name
     */
    public async createWorkspace (
        name: string
    ) : Promise<Workspace> {
        const item = createWorkspace('new', name);
        LOG.debug('createWorkspace: item: ', item);
        const repositoryItem = createWorkspaceRepositoryItem('new', item);
        LOG.debug('createWorkspace: repositoryItem: ', repositoryItem);
        const savedItem : WorkspaceRepositoryItem = await this._workspaceRepository.saveWorkspace(repositoryItem);
        LOG.debug('createWorkspace: savedItem: ', savedItem);
        return DashboardBackendService._prepareWorkspace(savedItem);
    }

    /**
     * Delete workspaces
     */
    public async deleteAllWorkspaces () : Promise<void> {
        await this._workspaceRepository.deleteAllWorkspaces();
        // FIXME: Add user deletion
    }

    /**
     * Delete workspaces
     */
    public async deleteSomeWorkspaces (
        idList : readonly string[]
    ) : Promise<void> {
        await this._workspaceRepository.deleteSomeWorkspaces(idList);
        // FIXME: Add user deletion
    }

    /**
     * Get list all of all workspaces
     */
    public async getFullWorkspaceList (
    ) : Promise<readonly Workspace[]> {
        const list : readonly WorkspaceRepositoryItem[] = await this._workspaceRepository.getAllWorkspaces();
        return map(list, (item : WorkspaceRepositoryItem) => DashboardBackendService._prepareWorkspace(item));
    }

    /**
     * Get list of workspaces
     *
     * @param idList If defined, only these workspaces are fetched
     */
    public async getSomeWorkspaceList (
        idList : readonly string[]
    ) : Promise<readonly Workspace[]> {
        const list : readonly WorkspaceRepositoryItem[] = await this._workspaceRepository.getSomeWorkspaces(idList);
        return map(list, (item : WorkspaceRepositoryItem) => DashboardBackendService._prepareWorkspace(item));
    }

    private static _prepareWorkspace (item: WorkspaceRepositoryItem) : Workspace {
        return createWorkspace(item.id, item.target.name);
    }


    // ****************** USERS ******************

    /**
     * Create new user in workspace
     *
     * @param item
     */
    public async createUser (
        item : User
    ) : Promise<User> {

        const workspaceId = item?.workspaceId;
        if (!workspaceId) throw new TypeError('createUser: workspaceId is required');
        LOG.debug('createUser: workspaceId: ', workspaceId);

        const workspace = await this._workspaceRepository.getWorkspaceById(workspaceId);
        if (!workspace) throw new TypeError(`createUser: Workspace does not exist by id "${workspaceId}"`);
        LOG.debug('createUser: workspace: ', workspace);

        LOG.debug('createUser: item: ', item);
        const repositoryItem = createUserRepositoryItem('new', workspaceId, item?.email, item);
        LOG.debug('createUser: repositoryItem: ', repositoryItem);
        const savedItem : UserRepositoryItem = await this._userRepository.saveUser(repositoryItem);
        LOG.debug('createUser: savedItem: ', savedItem);

        return DashboardBackendService._prepareUser(savedItem);

    }

    public async getUserListForWorkspace (
        workspaceId: string
    ) : Promise<User[]> {
        const list : UserRepositoryItem[] = await this._userRepository.getAllUsersByWorkspaceId(workspaceId);
        return map(list, (item : UserRepositoryItem) => DashboardBackendService._prepareUser(item));
    }

    public async getUserListByEmail (
        email: string
    ) : Promise<User[]> {
        const list : UserRepositoryItem[] = await this._userRepository.getAllUsersByEmail(email);
        return map(list, (item : UserRepositoryItem) => DashboardBackendService._prepareUser(item));
    }

    public async getUserForWorkspace (
        workspaceId: string,
        userId: string
    ) : Promise<User | undefined> {
        const item : UserRepositoryItem | undefined = await this._userRepository.getUserById(userId);
        if (!item) return undefined;
        if (item.workspaceId !== workspaceId) return undefined;
        return DashboardBackendService._prepareUser(item);
    }

    public async updateUserForWorkspace (
        workspaceId: string,
        ticketId: string,
        data: Partial<User>
    ) : Promise<User> {

        const item : UserRepositoryItem | undefined = await this._userRepository.getUserById(ticketId);
        if (!item) throw new TypeError(`updateUserForWorkspace: User not found`);
        if (item.workspaceId !== workspaceId) throw new TypeError('updateUserForWorkspace: User not for this workspace')

        const newTarget = {
            ...item.target,
            ...data
        };

        const newItem = {
            ...item,
            target: newTarget
        };

        return DashboardBackendService._prepareUser(await this._userRepository.saveUser(newItem) );
    }

    private static _prepareUser (item: UserRepositoryItem) : User {
        return createUser(
            item?.target?.workspaceId,
            item?.id,
            item?.target?.name,
            item?.target?.email
        );
    }

}
