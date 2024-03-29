// Copyright (c) 2022. Heusala Group <info@heusalagroup.fi>. All rights reserved.

import { parseNonEmptyString } from "../fi/hg/core/types/String";
import { LogLevel, parseLogLevel } from "../fi/hg/core/types/LogLevel";
import {
    BUILD_COMMAND_NAME,
    BUILD_LOG_LEVEL,
    BUILD_BACKEND_URL,
    BUILD_JWT_SECRET,
    BUILD_EMAIL_CONFIG,
    BUILD_EMAIL_FROM,
    BUILD_IO_SERVER,
    BUILD_JWT_ALG,
    BUILD_DEFAULT_LANGUAGE
} from "./build";

export const BACKEND_LOG_LEVEL       : LogLevel = parseLogLevel(parseNonEmptyString(process?.env?.BACKEND_LOG_LEVEL) ?? parseNonEmptyString(BUILD_LOG_LEVEL)) ?? LogLevel.INFO ;
export const BACKEND_SCRIPT_NAME     : string   = parseNonEmptyString(process?.env?.BACKEND_SCRIPT_NAME)     ?? BUILD_COMMAND_NAME;
export const BACKEND_URL             : string   = parseNonEmptyString(process?.env?.BACKEND_URL)             ?? BUILD_BACKEND_URL;
export const BACKEND_JWT_SECRET      : string   = parseNonEmptyString(process?.env?.BACKEND_JWT_SECRET)      ?? BUILD_JWT_SECRET;
export const BACKEND_JWT_ALG         : string   = parseNonEmptyString(process?.env?.BACKEND_JWT_ALG)         ?? BUILD_JWT_ALG;
export const BACKEND_EMAIL_CONFIG    : string   = parseNonEmptyString(process?.env?.BACKEND_EMAIL_CONFIG)    ?? BUILD_EMAIL_CONFIG;
export const BACKEND_EMAIL_FROM      : string   = parseNonEmptyString(process?.env?.BACKEND_EMAIL_FROM)      ?? BUILD_EMAIL_FROM;
export const BACKEND_IO_SERVER       : string   = parseNonEmptyString(process?.env?.BACKEND_IO_SERVER)       ?? BUILD_IO_SERVER;
export const BACKEND_DEFAULT_LANGUAGE : string   = parseNonEmptyString(process?.env?.BACKEND_DEFAULT_LANGUAGE) ?? BUILD_DEFAULT_LANGUAGE;
