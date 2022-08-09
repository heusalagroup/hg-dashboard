// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ReactNode } from "react";
import { TFunction } from "i18next";
import { MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppHeader } from "../../common/layout/appHeader/AppHeader";
import { AppModalContainer } from "../../common/layout/appModalContainer/AppModalContainer";
import { useAppModal } from "../../../hooks/modal/useAppModal";
import "./MainLayout.scss";

export interface MainLayoutProps {
    readonly t: TFunction;
    readonly children: ReactNode;
}

export function MainLayout(props: MainLayoutProps) {
    const t = props?.t;
    const modal = useAppModal();

    return (
        <div className={MAIN_LAYOUT_CLASS_NAME}>

            <AppHeader
                className={`${MAIN_LAYOUT_CLASS_NAME}-header`}
                t={t}
            />

            <section className={`${MAIN_LAYOUT_CLASS_NAME}-content`}>

                {props.children}

                <AppModalContainer
                    className={`${MAIN_LAYOUT_CLASS_NAME}-content-modals`}
                    t={t}
                    modal={modal}
                />

            </section>

        </div>
    );
}
