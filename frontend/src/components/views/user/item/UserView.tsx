// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {USER_LIST_VIEW_CLASS_NAME, USER_VIEW_CLASS_NAME} from "../../../../constants/appClassName";
import { TFunction } from "i18next";
import {TableRow} from "../../../../fi/hg/frontend/components/table/TableRow";
import {TableColumn} from "../../../../fi/hg/frontend/components/table/TableColumn";
import {Link, useLocation} from "react-router-dom";
import {AppModalType} from "../../../../types/AppModalType";
import {User} from "../../../../fi/hg/dashboard/types/User";
import {useAppCallback} from "../../../../hooks/modal/useAppCallback";
import {getUserRoute} from "../../../../constants/route";
import {EditIcon} from "../../../../assets/icons";
import {Icon} from "../../../../fi/hg/frontend/components/icon/Icon";
import "./UserView.scss";

export interface UserViewProps {
    readonly t: TFunction;
    readonly className ?: string;
    readonly index ?: number;
    readonly item: User;
    readonly arr : readonly User[] ;
}

export function UserView (props: UserViewProps) {

    const className = props?.className;
    const index = props?.index ?? 0;
    const item = props?.item;
    const arr = props?.arr;

    const location = useLocation();
    const currentRoute = getUserRoute(item.workspaceId, item.id);
    const openEditUserModalCallback = useAppCallback(AppModalType.EDIT_USER_MODAL, item.id);

    return (
           <TableRow
                key={`user-list-item-${item?.id}`}
                first={index === 0}
                last={index + 1 === arr?.length  }
            >
                <TableColumn
                    first={true}
                    className={USER_LIST_VIEW_CLASS_NAME+'-column ' + USER_LIST_VIEW_CLASS_NAME+'-column-name'}
                >{item.name}</TableColumn>

                <TableColumn
                    className={USER_LIST_VIEW_CLASS_NAME+'-column ' + USER_LIST_VIEW_CLASS_NAME+'-column-email'}
                >{item.email}</TableColumn>

                <TableColumn
                    className={USER_LIST_VIEW_CLASS_NAME+'-column ' + USER_LIST_VIEW_CLASS_NAME+'-column-controls'}
                    last={true}
                >
                    {/*<OpenEditUserModalButton id={item.id} style={ButtonStyle.SECONDARY} />*/}
                    <Link key={item.id}
                          to={{pathname: currentRoute}}
                          state={{ backgroundLocation: location }}
                          onClick={openEditUserModalCallback}
                          className={USER_LIST_VIEW_CLASS_NAME}
                    ><Icon><EditIcon /></Icon></Link>
                </TableColumn>
           </TableRow>

    );

}
