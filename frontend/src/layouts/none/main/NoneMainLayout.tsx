// Copyright (c) 2021-2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { DARK_MAIN_LAYOUT_CLASS_NAME, NONE_MAIN_LAYOUT_CLASS_NAME } from "../../../constants/appClassName";
import { AppHeader } from "../../../components/common/layout/appHeader/AppHeader";
import { AppModalContainer } from "../../../components/common/layout/appModalContainer/AppModalContainer";
import { useAppModal } from "../../../hooks/modal/useAppModal";
import { LayoutProps } from "../../../types/DashboardLayout";
import { AppNav } from "../../../components/common/layout/appNav/AppNav";
import "./NoneMainLayout.scss";

export function NoneMainLayout (props: LayoutProps) {
    const t = props?.t;
    const modal = useAppModal();
    return (
        <div className={NONE_MAIN_LAYOUT_CLASS_NAME}>
            <AppHeader
                className={`${NONE_MAIN_LAYOUT_CLASS_NAME}-header`}
                t={t}
            />
            <section className={`${NONE_MAIN_LAYOUT_CLASS_NAME}-content`}>
                <AppNav
                    className={`${DARK_MAIN_LAYOUT_CLASS_NAME}-content-nav`}
                    t={t}
                />
                {props.children}
                <AppModalContainer
                    className={`${NONE_MAIN_LAYOUT_CLASS_NAME}-content-modals`}
                    t={t}
                    modal={modal}
                />
            </section>
        </div>
    );
}
