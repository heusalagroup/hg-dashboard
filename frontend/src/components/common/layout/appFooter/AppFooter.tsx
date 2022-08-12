// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import {
    T_FOOTER_COPYRIGHT_TEXT,
} from "../../../../constants/translation";
import { APP_FOOTER_CLASS_NAME } from "../../../../constants/appClassName";
import { TranslationFunction } from "../../../../fi/hg/core/types/TranslationFunction";
import "./AppFooter.scss";

export interface AppFooterProps {
    readonly t: TranslationFunction;
    readonly className?: string;
}

export function AppFooter (props: AppFooterProps) {
    const t = props?.t;
    const className = props?.className;
    return (
        <footer className={APP_FOOTER_CLASS_NAME + (className ? ` ${className}` : "")}>
            <div className={APP_FOOTER_CLASS_NAME + "-content"}>
                <div className={APP_FOOTER_CLASS_NAME + "-copyright"}>
                    {t(T_FOOTER_COPYRIGHT_TEXT)}
                </div>
            </div>
        </footer>
    );
}
