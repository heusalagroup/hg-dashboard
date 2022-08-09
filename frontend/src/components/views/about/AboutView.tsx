// Copyright (c) 2021. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { ABOUT_VIEW_CLASS_NAME } from "../../../constants/appClassName";
import { TFunction } from "i18next";
import "./AboutView.scss";

export interface AboutViewProps {
    readonly t: TFunction;
    readonly className?: string;
}

export function AboutView (props: AboutViewProps) {
    return (
        <div className={ABOUT_VIEW_CLASS_NAME}>
            <article>

                <h2>HG Dashboard v1</h2>

                <p>sales@hg.fi</p>

            </article>
        </div>
    );
}


