// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { EmailAuthSessionService } from "../fi/hg/frontend/services/EmailAuthSessionService";
import { User } from "../fi/hg/dashboard/types/User";
import { DashboardClient } from "../fi/hg/dashboard/services/DashboardClient";
import { LogService } from "../fi/hg/core/LogService";
import {ProfileService} from "./ProfileService";

const LOG = LogService.createLogger('UserService');

export enum UserServiceEvent {
    USER_ADDED = "UserService:itemAdded",
    USER_UPDATED = "UserService:itemUpdated",
    USER_REMOVED = "UserService:itemRemoved",

/**
 * Triggered when current user is changed.
 *
 * Use `UserService.getWorkspaceId()` to fetch the new ID.
 */
     CURRENT_USER_CHANGED = "UserService:currentUserChanged"
}

export type UserServiceDestructor = ObserverDestructor;

export class UserService {

    private static _observer : Observer<UserServiceEvent> = new Observer<UserServiceEvent>("UserService");

    public static Event = UserServiceEvent;

    private static _user: User | undefined;
    public static getCurrentUser (): User | undefined {
        return this._user;
    }

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
        workspaceId : string,
        userId      : string
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

    /** Check all needed information when initialize profileService, email && workspace*/
    public static async setCurrentUser (user: User | undefined) {

        if ( user !== this._user ) {
            LOG.info("setCurrentUser;", user)
            this._user = user;
            if ( this._observer.hasCallbacks(UserServiceEvent.CURRENT_USER_CHANGED) ) {
                if (user){
                    this._user = user;
                }else {
                    LOG.debug(`useSelectWorkspaceUserCallback: Did not find user `);
                }

                this._observer.triggerEvent(UserServiceEvent.CURRENT_USER_CHANGED);
            }
        }
    }

    public static initialize () {
        LOG.info(`Initializing user`);
        this._initializeUser().catch((err) => {
            LOG.error(`ERROR: Could not initialize user: `, err);
        });
    }

    public static async _initializeUser () {
        ProfileService.initialize();
    }

}
