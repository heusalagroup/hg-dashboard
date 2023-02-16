// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {USER_LIST_VIEW_CLASS_NAME} from "../../../../constants/appClassName";
import {TFunction} from "i18next";
import {useWorkspaceUserList} from "../../../../hooks/user/useWorkspaceUserList";
import {
    T_USER_LIST_TITLE,
    T_USER_TABLE_EMAIL_TITLE,
    T_USER_TABLE_NAME_TITLE,
    T_USER_TABLE_NO_RESULTS
} from "../../../../constants/translation";
import {map} from "../../../../fi/hg/core/functions/map";
import {OpenNewUserModalButton} from "../../../common/user/openNewUserModalButton/OpenNewUserModalButton";
import {useEventUserAdded} from "../../../../hooks/user/useEventUserAdded";
import {LogService} from "../../../../fi/hg/core/LogService";
import {useEventUserRemoved} from "../../../../hooks/user/useEventUserRemoved";
import {useEventUserUpdated} from "../../../../hooks/user/useEventUserUpdated";
import {useEventCurrentWorkspaceChanged} from "../../../../hooks/workspace/useEventCurrentWorkspaceChanged";
import {useIntervalUpdate} from "../../../../fi/hg/frontend/hooks/useIntervalUpdate";
import {USER_LIST_UPDATE_INTERVAL_IN_MS} from "../../../../constants/frontend";
import {useCurrentWorkspaceId} from "../../../../hooks/workspace/useCurrentWorkspaceId";
import {Loader} from "../../../../fi/hg/frontend/components/loader/Loader";
import {TableHeaderColumn} from "../../../../fi/hg/frontend/components/table/TableHeaderColumn";
import {TableHeader} from "../../../../fi/hg/frontend/components/table/TableHeader";
import {TableBody} from "../../../../fi/hg/frontend/components/table/TableBody";
import {Table} from "../../../../fi/hg/frontend/components/table/Table";
import {TableColumn} from "../../../../fi/hg/frontend/components/table/TableColumn";
import {TableRow} from "../../../../fi/hg/frontend/components/table/TableRow";
import {User} from "../../../../fi/hg/dashboard/types/User";
import {AppModalType} from "../../../../types/AppModalType";
import {ReactNode} from "react";
import {UserView} from "../item/UserView";
import {AppModalContainer} from "../../../common/layout/appModalContainer/AppModalContainer";
import "./UserListView.scss";

const LOG = LogService.createLogger('UserListView');

export interface UserListViewProps {
    readonly t: TFunction;
    readonly className ?: string;
    readonly children ?: ReactNode;
}

export function UserListView (props: UserListViewProps) {

    const workspaceId = useCurrentWorkspaceId();
    const t = props?.t;
    const className = props?.className;

    const [userList, refreshCallback] = useWorkspaceUserList(workspaceId);

    useEventUserAdded(() => {
        LOG.debug(`User added, refreshing list`);
        refreshCallback();
    });

    useEventUserUpdated(() => {
        LOG.debug(`User updated, refreshing list`);
        refreshCallback();
    });

    useEventUserRemoved(() => {
        LOG.debug(`User removed, refreshing list`);
        refreshCallback();
    });

    useEventCurrentWorkspaceChanged(() => {
        LOG.debug(`Workspace changed, refreshing list`);
        refreshCallback();
    });

    // FIXME: This should be done using events from backend
    useIntervalUpdate(
        () => {
            LOG.debug(`Periodical update triggered`);
            refreshCallback();
        },
        USER_LIST_UPDATE_INTERVAL_IN_MS
    );

    if (!workspaceId) {
        return <Loader />;
    }

    return (
        <div className={
            USER_LIST_VIEW_CLASS_NAME
            + (className? ` ${className}` : '')
        }>
            {
            props.children ?
                <AppModalContainer t={t} modal={AppModalType.EDIT_USER_MODAL} />
                : null
                }

            <header className={USER_LIST_VIEW_CLASS_NAME+'-header'}>
                <h3 className={USER_LIST_VIEW_CLASS_NAME+'-header-title'}>{t(T_USER_LIST_TITLE)}</h3>
                <div className={USER_LIST_VIEW_CLASS_NAME+'-header-controls'}>
                    <OpenNewUserModalButton />
                </div>
            </header>

             <Table className={USER_LIST_VIEW_CLASS_NAME+'-table'}>

                <TableHeader>
                    <TableHeaderColumn first={true}>{t(T_USER_TABLE_NAME_TITLE)}</TableHeaderColumn>
                    <TableHeaderColumn>{t(T_USER_TABLE_EMAIL_TITLE)}</TableHeaderColumn>
                    <TableHeaderColumn last={true} />
                </TableHeader>

                <TableBody>{
                    (userList?.length ?? 0) === 0 ? (
                        <TableRow>
                            <TableColumn
                                first={true}
                                last={true}
                                className={USER_LIST_VIEW_CLASS_NAME+'-no-results'}
                                colSpan={3}>{t(T_USER_TABLE_NO_RESULTS)}</TableColumn>
                        </TableRow>
                    ) : map(userList, (item : User, index:number, arr: User[]) => {
                        return (
                            <UserView
                                t={t}
                                key={`user-list-item-${item?.id}`}
                                index={index}
                                item={item}
                                arr={arr}
                            />

                        );
                    })
                }
                </TableBody>
            </Table>

        </div>)
    }
