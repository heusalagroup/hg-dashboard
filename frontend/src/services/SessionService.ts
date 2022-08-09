// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { HttpService } from "../fi/hg/core/HttpService";
import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { EmailTokenDTO } from "../fi/hg/core/auth/email/types/EmailTokenDTO";
import { LogService } from "../fi/hg/core/LogService";
import { EmailAuthSessionService } from "../fi/hg/frontend/services/EmailAuthSessionService";
import { isProfile, Profile } from "../fi/hg/dashboard/types/Profile";
import { DASHBOARD_API_GET_MY_PROFILE_PATH } from "../fi/hg/dashboard/constants/dashboard-api";

export enum SessionServiceEvent {
    PROFILE_UPDATED = "SessionService:profileUpdated"
}

export type SessionServiceDestructor = ObserverDestructor;

const LOG = LogService.createLogger('SessionService');

export class SessionService {

    private static _isInitialized: boolean = SessionService._onInit();
    private static _observer: Observer<SessionServiceEvent> = new Observer<SessionServiceEvent>("SessionService");
    private static _profile: Profile | undefined = undefined;

    public static Event = SessionServiceEvent;

    public static on(
        name: SessionServiceEvent,
        callback: ObserverCallback<SessionServiceEvent>
    ): SessionServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy(): void {
        this._observer.destroy();
    }

    public static getProfile(): Profile | undefined {
        return this._profile;
    }

    public static isLoggedIn(): boolean {
        return EmailAuthSessionService.hasSession();
    }

    public static logout() {
        EmailAuthSessionService.forgetToken();
    }

    // Private methods

    private static async _refreshProfile(): Promise<void> {
        const emailToken = EmailAuthSessionService.getEmailToken();
        if (emailToken) {
            try {
                const profile = await this._getProfile(emailToken);
                LOG.info(`Profile updated: `, profile);
                this._profile = profile;
                if (this._observer.hasCallbacks(SessionServiceEvent.PROFILE_UPDATED)) {
                    this._observer.triggerEvent(SessionServiceEvent.PROFILE_UPDATED);
                }
            } catch (err) {
                LOG.error(`ERROR: _refreshProfile: Could not fetch profile: `, err);
                this._profile = undefined;
            }
        } else {
            this._profile = undefined;
        }
    }

    private static async _getProfile(token: EmailTokenDTO): Promise<Profile> {

        let headers: any = {};
        if (token?.verified && token.token) {
            headers['X-Authorization'] = token.token;
        }

        const item = await HttpService.getJson(DASHBOARD_API_GET_MY_PROFILE_PATH, headers);

        if (!isProfile(item)) {
            LOG.debug(`Response: `, item);
            throw new TypeError(`Response was not Profile`);
        }

        return item;
    }

    private static _onInit (): boolean {
        // FIXME: Handle timeout destruction on destroy
        setTimeout(() => {

            // FIXME: Cancel call if service is destroyed
            this._refreshProfile().catch(err => {
                LOG.error(`_initializeEmailToken: Error while refreshing profile data: `, err);
            });

            // FIXME: Handle listener destruction on service destroy
            EmailAuthSessionService.on(
                EmailAuthSessionService.Event.EMAIL_TOKEN_UPDATED,
                () => {
                    this._refreshProfile().catch(err => {
                        LOG.error(`_setEmailToken: Error while refreshing profile data: `, err);
                    });
                }
            );

        }, 10); // FIXME: Change timeout delay value as a constant or configurable option
        return true;
    }

}
