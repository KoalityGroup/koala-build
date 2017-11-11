import * as fs from 'fs';
import * as path from 'path';

import { IConfigLookup, LookupObject } from 'locators/configLookup';

export const BUILD_PATH = path.resolve(__dirname, '__venv__', 'build');
export const CONFIG_PATH = path.resolve(__dirname, '__venv__', 'build', 'config');

export function formatLookup(lookup: IConfigLookup) {
    return `Lookup: '${lookup.objectName}' -> ${LookupObject[lookup.object]}`;
}

export default {
    BUILD_PATH,
    CONFIG_PATH
};
