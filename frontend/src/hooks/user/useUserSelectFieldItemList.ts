// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { SelectFieldItem } from "../../fi/hg/frontend/types/items/SelectFieldModel";
import { useEffect, useState } from "react";
import { map } from "../../fi/hg/core/functions/map";
import { User } from "../../fi/hg/dashboard/types/User";

export function useUserSelectFieldItemList(
    list: readonly User[] | undefined
): readonly SelectFieldItem<String>[] | undefined {
    const [itemList, setItemList] = useState<SelectFieldItem<string>[] | undefined>(undefined);
    useEffect(
        () => {
            setItemList(
                list ? map(list, (data: User): SelectFieldItem<string> => {
                    return {
                        label: data.name,
                        value: data.id
                    };
                }) : undefined
            );
        },
        [
            setItemList,
            list
        ]
    );
    return itemList;
}
