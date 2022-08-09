// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { AppModalType } from "../../types/AppModalType";
import { useCallback, useState } from "react";
import { AppModalService, AppModalServiceEvent } from "../../services/AppModalService";
import { LogService } from "../../fi/hg/core/LogService";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";

const LOG = LogService.createLogger('useAppModal');

export function useAppModal () : AppModalType | undefined {

    const [currentModal, setCurrentModal] = useState<AppModalType | undefined>(
        () => {
            const modal = AppModalService.getCurrentModal();
            LOG.debug(`Modal initialized as `, modal);
            return modal;
        }
    );

    const modalChangedEventCallback = useCallback(
        () => {
            setCurrentModal( () => {
                const modal = AppModalService.getCurrentModal();
                LOG.debug(`Modal changed as `, modal);
                return modal;
            } );
        },
        [
            setCurrentModal
        ]
    );

    useServiceEvent(
        AppModalService,
        AppModalServiceEvent.MODAL_CHANGED,
        modalChangedEventCallback
    );

    return currentModal;

}
