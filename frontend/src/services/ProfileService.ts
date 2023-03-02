// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { EmailAuthSessionService } from "../fi/hg/frontend/services/EmailAuthSessionService";
import { User } from "../fi/hg/dashboard/types/User";
import { DashboardClient } from "../fi/hg/dashboard/services/DashboardClient";
import { LogService } from "../fi/hg/core/LogService";
import {WorkspaceService} from "./WorkspaceService";
import {UserService} from "./UserService";

const LOG = LogService.createLogger('ProfileService');

export enum ProfileServiceEvent {
    PROFILE_ADDED = "ProfileService:itemAdded",
    PROFILE_UPDATED = "ProfileService:itemUpdated",
    PROFILE_REMOVED = "ProfileService:itemRemoved",

    /**
     * Triggered when current profile is changed.
     *
     * Use `UserService.getWorkspaceId()` to fetch the new ID.
     */
    CURRENT_PROFILE_CHANGED = "ProfileService:currentProfileChanged"
}

export type ProfileServiceDestructor = ObserverDestructor;

export class ProfileService {

    private static _observer : Observer<ProfileServiceEvent> = new Observer<ProfileServiceEvent>("ProfileService");

    public static Event = ProfileServiceEvent;

    public static on(
        name: ProfileServiceEvent,
        callback: ObserverCallback<ProfileServiceEvent>
    ): ProfileServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }


    /**
     * get USER information based on workspace */
    public static async getWorkspaceUserByProfile (
        workspaceId : string
    ): Promise<User | undefined> {

        const token: EmailTokenDTO | undefined = EmailAuthSessionService.getEmailToken();
        if (!token) {
            LOG.debug(`getWorkspaceUserList: No session`);
            return undefined;
        }
        const client = new DashboardClient(); // FIXME: Save client somewhere in a service as reusable
        client.setSessionToken(token);
        if (!client.hasVerifiedSession()) {
            LOG.debug(`getWorkspaceUserList: No verified session`);
            return undefined;
        }

        if (!workspaceId) {
            LOG.debug(`getMyUserList: No workspace`);
            return undefined;
        }

        return await client.getWorkspaceUserByProfile(workspaceId);

    }


    public static initialize () {
        LOG.info(`Initializing users profile`);
        this._initializeProfile().catch((err) => {
            LOG.error(`ERROR: Could not initialize profile: `, err);
        });
    }

    /**
     * set current user
     * */
    public static async _initializeProfile () {
        const email: string | undefined = EmailAuthSessionService.getEmailAddress();
        LOG.debug("User email;", email)
        const workspace = WorkspaceService.getCurrentWorkspaceId()
        if (email && workspace) {
            const profile = await ProfileService.getWorkspaceUserByProfile(workspace)

            if (profile) {
                    LOG.info("Initialize user: ", profile)
                    await UserService.setCurrentUser(profile);
                }

        } else {
            LOG.info("NOT yet User email: ", email, ' or workspace ', workspace)
        }
    }

}
