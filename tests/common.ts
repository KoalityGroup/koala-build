import * as fs from 'fs';
import * as path from 'path';

import { IBuildInfo } from 'KoalaBuild';
import { IConfigLookup, LookupObject } from 'locators/configLookup';

export const BUILD_PATH = path.resolve(__dirname, '__venv__', 'build');
export const CONFIG_PATH = path.resolve(__dirname, '__venv__', 'build', 'config');

export function formatLookup(lookup: IConfigLookup) {
    return `Lookup: '${lookup.objectName}' -> ${LookupObject[lookup.object]}`;
}

export function makeBuildInfo(str: string): IBuildInfo {
    let parts = str.split(',');
    return {
        environment: parts[0],
        configuration: parts[1],
        target: {
            architecture: parts[2],
            operatingSystem: parts[3],
            processHost: parts[4]
        },
        options: parts.length >= 6 ? parts.slice(5) : []
    };
}

export default {
    BUILD_PATH,
    CONFIG_PATH
};
