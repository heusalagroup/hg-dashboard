// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { EmailAuthSessionService } from "../fi/hg/frontend/services/EmailAuthSessionService";
import { User } from "../fi/hg/dashboard/types/User";
import { DashboardClient } from "../fi/hg/dashboard/services/DashboardClient";
import { LogService } from "../fi/hg/core/LogService";

const LOG = LogService.createLogger('UserService');

export enum UserServiceEvent {
    USER_ADDED = "UserService:itemAdded",
    USER_UPDATED = "UserService:itemUpdated",
    USER_REMOVED = "UserService:itemRemoved"
}

export type UserServiceDestructor = ObserverDestructor;

export class UserService {

    private static _observer : Observer<UserServiceEvent> = new Observer<UserServiceEvent>("UserService");

    public static Event = UserServiceEvent;

    public static on(
        name: UserServiceEvent,
        callback: ObserverCallback<UserServiceEvent>
    ): UserServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static async saveWorkspaceUser (
        workspaceId: string,
        item: User
    ): Promise<User> {

        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) throw new TypeError('saveUser: Must login first');
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) throw new TypeError('saveUser: Must login first');

        const userId = item?.id;

        if (userId === "new") {
            const newItem = await client.createWorkspaceUser(item);
            if (this._observer.hasCallbacks(UserServiceEvent.USER_ADDED)) {
                this._observer.triggerEvent(UserServiceEvent.USER_ADDED);
            }
            if (this._observer.hasCallbacks(UserServiceEvent.USER_UPDATED)) {
                this._observer.triggerEvent(UserServiceEvent.USER_UPDATED);
            }
            return newItem;
        }

        const updatedItem = await client.updateWorkspaceUser(workspaceId, userId, item);
        if (this._observer.hasCallbacks(UserServiceEvent.USER_UPDATED)) {
            this._observer.triggerEvent(UserServiceEvent.USER_UPDATED);
        }
        return updatedItem;

    }

    public static async getWorkspaceUserList (
        workspaceId : string
    ): Promise<readonly User[]> {

        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) {
            LOG.debug(`getMyUserList: No session`);
            return [];
        }
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) {
            LOG.debug(`getMyUserList: No verified session`);
            return [];
        }

        if (!workspaceId) {
            LOG.debug(`getMyUserList: No workspace`);
            return [];
        }

        return await client.getWorkspaceUserList(workspaceId);

    }

    public static async getWorkspaceUser (
        userId      : string,
        workspaceId : string
    ): Promise<User | undefined> {

        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) return undefined;
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) return undefined;

        const myWorkspaceId = workspaceId;
        if (!myWorkspaceId) return undefined;

        return await client.getWorkspaceUser(myWorkspaceId, userId);

    }

    public static initialize () {
    }

}
