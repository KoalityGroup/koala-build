import * as fs from 'fs';
import * as path from 'path';

import KoalaError from '../KoalaError';

import { IConfigLocator } from './ConfigLocator';
import { IConfigLookup, LookupObject } from './configLookup';

import { IConfigProvider } from '../providers/ConfigProvider';

import JsonConfigProvider from '../providers/JsonConfigProvider';
import LayeredJsonConfigProvider from '../providers/LayeredJsonConfigProvider';

export interface IFsConfigLocatorOptions {
    paths: {[obj: number]: string[]};
}

/**
 * This function joins together strings into a path using the folllowing rules:
 *  * for parts P1 and P2, if P1 ends with a forward slash (/) the parts will be path joined
 *  * for parts P1 and P2, if P1 does not end with a forward slash (/) the parts will be concatenated
 * 
 * @param {string[]} parts the parts of the path to join
 * @returns {string} the parts joined into a path string
 */
function joinPathParts(parts: string[]): string {
    if (parts.length === 0)
        return '';

    if (parts.length === 1)
        return parts[0];

    return parts.reduce((acc, next) => {
        if (acc.length === 0) // Should slice instead?
            return next;

        if (acc.endsWith('/'))
            return path.join(acc, next);
        
        return acc + next;
    }, '');
}

export default class FsConfigLocator implements IConfigLocator {
    private readonly _baseDir: string;
    private readonly _options: IFsConfigLocatorOptions;

    constructor(baseDir: string, options?: IFsConfigLocatorOptions) {
        if (!path.isAbsolute(baseDir))
            throw new KoalaError('baseDir must be an absolute path to a directory');

        if (!fs.existsSync(baseDir))
            throw new KoalaError('baseDir is refering to a non existent path');

        this._baseDir = baseDir;
        this._options = options || defaultOptions;

        // TODO: Check if options are valid
    }

    public locate(lookup: IConfigLookup): IConfigProvider {
        const lookupPath = this.resolveLookupPath(lookup);

        let dirPath = path.join(this._baseDir, lookupPath.dir, lookupPath.name);
        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory())
            return new LayeredJsonConfigProvider(dirPath);

        let jsonName = `${lookupPath.name}.json`;
        let jsonPath = path.join(this._baseDir, lookupPath.dir, jsonName);
        if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isFile())
            return JsonConfigProvider.fromFile(jsonPath);

        // Do not throw here, it's a lookup, lookups failing is nothing exceptional
        return null;
    }

    private resolveLookupPath(lookup: IConfigLookup) {
        let objectPath = this.resolveLookupObjectPath(lookup.object);
        return { dir: objectPath, name: lookup.objectName };
    }

    private resolveLookupObjectPath(lookup: LookupObject): string {
        if (!(lookup in this._options.paths))
            throw new KoalaError('Lookup object is invalid or unsupported');

        return joinPathParts(this._options.paths[lookup]);
    }
}

const defaultTargetPreix = 'target/';
const defaultOptions: IFsConfigLocatorOptions = {
    paths: {
        [LookupObject.Environment]: ['environment'],
        [LookupObject.Configuration]: ['configuration'],
        [LookupObject.TargetOs]: [defaultTargetPreix, 'os'],
        [LookupObject.TargetArch]: [defaultTargetPreix, 'arch'],
        [LookupObject.TargetHost]: [defaultTargetPreix, 'host'],
        [LookupObject.Option]: [defaultTargetPreix, 'misc'],
        [LookupObject.Fragment]: [defaultTargetPreix, 'imports'],
        [LookupObject.Baseline]: [defaultTargetPreix, '.baseline']
    }
};
