// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { useCallback } from "react";
import { TFunction } from "i18next";
import { useNavigate } from "react-router-dom";
import { LIST_BUTTON_CLASS_NAME } from "../../../constants/appClassName";
import { LogService } from "../../../fi/hg/core/LogService";
import "./ListButton.scss";

const LOG = LogService.createLogger('ListButton');

export interface ListButtonProps {
    readonly t            : TFunction;
    readonly className   ?: string;
    readonly isListRoute  : boolean;
    readonly listRoute    : string;
    readonly boardRoute   : string;
}

export function ListButton (props: ListButtonProps) {

    const className   = props?.className;
    const listRoute   = props.listRoute;
    const boardRoute  = props.boardRoute;
    const isListView  : boolean = !!props?.isListRoute;
    const isBoardView : boolean = !isListView;

    const navigate = useNavigate();
    LOG.debug(`location : `, isBoardView, isListView, listRoute, boardRoute);

    const toggleBoardCallback = useCallback(
        () => {
            LOG.debug(`Navigating to `, boardRoute);
            navigate(boardRoute);
        },
        [
            navigate,
            boardRoute
        ]
    );

    /** kun suljetaan näkyy vain dashboard */
    const toggleListCallback = useCallback(
        () => {
            LOG.debug(`Navigating to `, listRoute);
            navigate(listRoute);
        },
        [
            navigate,
            listRoute
        ]
    );

    return (
        <div className={LIST_BUTTON_CLASS_NAME + (className ? ` ${className}` : "")}>

            <button
                className={"button list-toggle " + (isListView ? "active-list" : 'list')}
                onClick={toggleListCallback}
            ><span>&#9776;</span></button>

            <button
                className={"button board-toggle " + (isBoardView ? "active-board" : "board" )}
                onClick={toggleBoardCallback}
            ><span>&#9608;</span> <span>&#9600;</span></button>

        </div>
    );
}


