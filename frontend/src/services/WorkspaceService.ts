// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { EmailAuthSessionService } from "../fi/hg/frontend/services/EmailAuthSessionService";
import { DashboardClient } from "../fi/hg/dashboard/services/DashboardClient";
import { Workspace } from "../fi/hg/dashboard/types/Workspace";
import { LogService } from "../fi/hg/core/LogService";
import { RouteService } from "../fi/hg/frontend/services/RouteService";
import { MY_WORKSPACE_LIST_ROUTE } from "../constants/route";
import {ProfileService} from "./ProfileService";

export enum WorkspaceServiceEvent {

    WORKSPACE_ADDED = "WorkspaceService:workspaceAdded",
    WORKSPACE_REMOVED = "WorkspaceService:workspaceRemoved",
    WORKSPACE_UPDATED = "WorkspaceService:workspaceUpdated",

    /**
     * Triggered when current workspace is changed.
     *
     * Use `WorkspaceService.getWorkspaceId()` to fetch the new ID.
     */
    CURRENT_WORKSPACE_CHANGED = "WorkspaceService:currentWorkspaceChanged"

}

export type WorkspaceServiceDestructor = ObserverDestructor;

const LOG = LogService.createLogger('WorkspaceService');

export class WorkspaceService {

    private static _workspace: Workspace | undefined;
    private static _observer: Observer<WorkspaceServiceEvent> = new Observer<WorkspaceServiceEvent>("WorkspaceService");

    public static Event = WorkspaceServiceEvent;

    public static getCurrentWorkspaceId (): string | undefined {
        return this._workspace?.id;
    }

    /**
     * Returns the workspace name, otherwise undefined.
     */
    public static getCurrentWorkspaceName (): string | undefined {
        return this._workspace?.name;
    }

    public static getCurrentWorkspace (): Workspace | undefined {
        return this._workspace;
    }

    public static on (
        name: WorkspaceServiceEvent,
        callback: ObserverCallback<WorkspaceServiceEvent>
    ): WorkspaceServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static initialize () {
        LOG.info(`Initializing`);
        this._initializeWorkspace().catch((err) => {
            LOG.error(`ERROR: Could not initialize workspace: `, err);
        });
    }

    public static async saveWorkspace (
        item: Workspace
    ): Promise<Workspace> {

        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) throw new TypeError('saveWorkspace: Must login first');
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) throw new TypeError('saveWorkspace: Must login first');

        const workspaceId = item?.id;

        if (workspaceId === "new") {
            const newItem = await client.createWorkspace(item?.name);
            if (this._observer.hasCallbacks(WorkspaceServiceEvent.WORKSPACE_ADDED)) {
                this._observer.triggerEvent(WorkspaceServiceEvent.WORKSPACE_ADDED);
            }
            if (this._observer.hasCallbacks(WorkspaceServiceEvent.WORKSPACE_UPDATED)) {
                this._observer.triggerEvent(WorkspaceServiceEvent.WORKSPACE_UPDATED);
            }
            return newItem;
        }

        const updatedItem = await client.updateWorkspace(workspaceId, item);
        if (this._observer.hasCallbacks(WorkspaceServiceEvent.WORKSPACE_UPDATED)) {
            this._observer.triggerEvent(WorkspaceServiceEvent.WORKSPACE_UPDATED);
        }
        return updatedItem;

    }

    public static async getMyWorkspaceList (): Promise<readonly Workspace[]> {
        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) {
            LOG.debug(`getMyWorkspaceList: No session`);
            return [];
        }
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) {
            LOG.debug(`getMyWorkspaceList: No verified session`);
            return [];
        }
        return await client.getMyWorkspaceList();
    }

    public static async setCurrentWorkspace (workspace: Workspace | undefined) {
        if ( workspace !== this._workspace ) {
            LOG.info("setCurrentWorkspace;", workspace)
            this._workspace = workspace;
            if ( this._observer.hasCallbacks(WorkspaceServiceEvent.CURRENT_WORKSPACE_CHANGED) ) {
               await ProfileService.initialize();
                LOG.info("setCurrentWorkspace;", workspace)

                this._observer.triggerEvent(WorkspaceServiceEvent.CURRENT_WORKSPACE_CHANGED);
            }
        }
    }

    private static async _initializeWorkspace () {
        RouteService.setRoute(MY_WORKSPACE_LIST_ROUTE);
    }

}
