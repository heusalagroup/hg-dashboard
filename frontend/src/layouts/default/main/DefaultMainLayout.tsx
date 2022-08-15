// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DEFAULT_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import { AppModalContainer } from "../../../components/common/layout/appModalContainer/AppModalContainer";
import { useAppModal } from "../../../hooks/modal/useAppModal";
import { LayoutProps } from "../../../types/DashboardLayout";
import "./DefaultMainLayout.scss";

export function DefaultMainLayout (props: LayoutProps) {
    const t = props?.t;
    const modal = useAppModal();
    return (
        <div className={DEFAULT_MAIN_LAYOUT_CLASS_NAME}>
            <AppHeader
                className={`${DEFAULT_MAIN_LAYOUT_CLASS_NAME}-header`}
                t={t}
            />
            <section className={`${DEFAULT_MAIN_LAYOUT_CLASS_NAME}-content`}>
                {props.children}
                <AppModalContainer
                    className={`${DEFAULT_MAIN_LAYOUT_CLASS_NAME}-content-modals`}
                    t={t}
                    modal={modal}
                />
            </section>
        </div>
    );
}
