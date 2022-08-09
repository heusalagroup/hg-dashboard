// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { Observer, ObserverCallback, ObserverDestructor } from "../fi/hg/core/Observer";
import { AppModalType } from "../types/AppModalType";

export enum AppModalServiceEvent {
    MODAL_CHANGED = "ModalService:modalChanged",
    ID_CHANGED = "ModalService:idChanged"
}

export type AppModalServiceDestructor = ObserverDestructor;

export class AppModalService {

    private static _observer: Observer<AppModalServiceEvent> = new Observer<AppModalServiceEvent>("AppModalService");
    private static _currentModal : AppModalType | undefined;
    private static _currentId : string | undefined;

    public static Event = AppModalServiceEvent;

    public static on (
        name: AppModalServiceEvent,
        callback: ObserverCallback<AppModalServiceEvent>
    ): AppModalServiceDestructor {
        return this._observer.listenEvent(name, callback);
    }

    public static destroy (): void {
        this._observer.destroy();
    }

    public static setCurrentModal (
        modal  : AppModalType | undefined,
        id    ?: string | undefined
    ) {

        let triggerModalChanged : boolean = false;
        let triggerIdChanged : boolean = false;

        if (this._currentModal !== modal) {
            this._currentModal = modal;
            triggerModalChanged = true;
        }

        if (this._currentId !== id) {
            this._currentId = id;
            triggerModalChanged = true;
            triggerIdChanged = true;
        }

        if (triggerModalChanged && this._observer.hasCallbacks(AppModalServiceEvent.MODAL_CHANGED)) {
            this._observer.triggerEvent(AppModalServiceEvent.MODAL_CHANGED);
        }

        if (triggerIdChanged && this._observer.hasCallbacks(AppModalServiceEvent.ID_CHANGED)) {
            this._observer.triggerEvent(AppModalServiceEvent.ID_CHANGED);
        }

    }

    public static getCurrentModal () : AppModalType | undefined {
        return this._currentModal;
    }

    public static getCurrentId () : string | undefined {
        return this._currentId;
    }

    public static setCurrentId (id : string | undefined) {
        if (this._currentId !== id) {
            this._currentId = id;
            if (this._observer.hasCallbacks(AppModalServiceEvent.MODAL_CHANGED)) {
                this._observer.triggerEvent(AppModalServiceEvent.MODAL_CHANGED);
            }
            if (this._observer.hasCallbacks(AppModalServiceEvent.ID_CHANGED)) {
                this._observer.triggerEvent(AppModalServiceEvent.ID_CHANGED);
            }
        }
    }

}
