// Copyright (c) 2022. Heusala Group Oy <info@heusalagroup.fi>. All rights reserved.

import { TranslationFunction } from "../fi/hg/core/types/TranslationFunction";
import { ReactNode } from "react";

export interface LayoutProps {
    readonly t          : TranslationFunction;
    readonly children   : ReactNode;
    readonly className ?: string;
}

export type LayoutComponent = (props: LayoutProps) => JSX.Element;

export interface DashboardLayout {
    readonly main     : LayoutComponent,
    readonly login    : LayoutComponent,
    readonly profile  : LayoutComponent
}
