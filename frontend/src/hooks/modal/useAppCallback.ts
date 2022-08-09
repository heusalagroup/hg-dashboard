// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { AppModalType } from "../../types/AppModalType";
import { AppModalService } from "../../services/AppModalService";
import { ButtonClickCallback } from "../../fi/hg/frontend/components/button/Button";
import { LogService } from "../../fi/hg/core/LogService";

const LOG = LogService.createLogger('useAppCallback');

/**
 * Can be used to create a callback function to open a specific modal
 *
 * @param modal
 * @param id
 */
export function useAppCallback (
    modal ?: AppModalType | undefined,
    id    ?: string | undefined
) : ButtonClickCallback {
    return useCallback(
        () => {
            LOG.info(`Opening modal `, modal, id);
            AppModalService.setCurrentModal(modal, id);
        },
        [
            modal,
            id
        ]
    );
}
