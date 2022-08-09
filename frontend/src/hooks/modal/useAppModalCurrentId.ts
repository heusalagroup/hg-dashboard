// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback, useState } from "react";
import { AppModalService, AppModalServiceEvent } from "../../services/AppModalService";
import { LogService } from "../../fi/hg/core/LogService";
import { useServiceEvent } from "../../fi/hg/frontend/hooks/useServiceEvent";

const LOG = LogService.createLogger('useAppModalCurrentId');

export function useAppModalCurrentId () : string | undefined {

    const [currentId, setCurrentId] = useState<string | undefined>(
        () => {
            const modal = AppModalService.getCurrentId();
            LOG.debug(`Modal ID initialized as `, modal);
            return modal;
        }
    );

    const modalChangedEventCallback = useCallback(
        () => {
            setCurrentId( () => {
                const id = AppModalService.getCurrentId();
                LOG.debug(`Modal ID changed as `, id);
                return id;
            } );
        },
        [
            setCurrentId
        ]
    );

    useServiceEvent(
        AppModalService,
        AppModalServiceEvent.ID_CHANGED,
        modalChangedEventCallback
    );

    return currentId;

}
