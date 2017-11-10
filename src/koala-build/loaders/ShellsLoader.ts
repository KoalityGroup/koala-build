import * as _ from 'lodash';
import KoalaError from '../KoalaError';

import { IConfigLoader } from '.';
import { IBuildInfo } from '../KoalaBuild';
import { IConfigLocator } from '../locators/ConfigLocator';

import configLookup, { IConfigLookup, LookupObject } from '../locators/configLookup';

export interface ILoaderShell {
    name: string;
    locator: IConfigLocator;
    fallbackLocator?: IConfigLocator;
    defaults: IConfigLookup[];
}

export function createShell(
    name: string, 
    locator: IConfigLocator, 
    defaults: IConfigLookup[] = []
): ILoaderShell {
    return createShellWithFallback(name, locator, defaults, null);
}

export function createShellWithFallback(
    name: string, 
    locator: IConfigLocator, 
    defaults: IConfigLookup[] = [],
    fallbackLocator: IConfigLocator = null
): ILoaderShell {
    if (!name)
        throw new KoalaError('name must have a value');

    if (!locator)
        throw new KoalaError('locator must have a value');

    return { name, locator, defaults, fallbackLocator };
}

function selectFirst<T, C>(array: T[], selector: (value: T) => C): C {
    for (let item of array) {
        let select = selector(item);
        if (select !== null)
            return select;
    }

    return null;
}

export default class ShellsLoader implements IConfigLoader {
    private readonly _shells: Array<{priority: number; shell: ILoaderShell}>;

    constructor() {
        this._shells = [];
    }

    public loadSeeds(buildInfo: IBuildInfo): object[] {
        if (this._shells.length === 0)
            return [];

        // Use top-down lookup to avoid voided lookups
        let lookups = this.generateLookups(buildInfo);
        return this.loadShells(lookups, true);
    }

    public loadPartial(lookup: IConfigLookup): object[] {
        return this.loadShells([lookup], false);
    }

    private generateLookups(buildInfo: IBuildInfo): IConfigLookup[] {
        const cfConfiguration = configLookup(LookupObject.Configuration, buildInfo.configuration);
        const cfEnvironment = configLookup(LookupObject.Environment, buildInfo.environment);
        const cfTargetArch = configLookup(LookupObject.TargetArch, buildInfo.target.architecture);
        const cfTargetOs = configLookup(LookupObject.TargetOs, buildInfo.target.operatingSystem);
        const cfTargetHost = configLookup(LookupObject.TargetHost, buildInfo.target.processHost);
        const cfOptions = buildInfo.options.map(opt => configLookup(LookupObject.Option, opt));

        return [ cfConfiguration, cfEnvironment, cfTargetArch, cfTargetOs, cfTargetHost, ...cfOptions ];
    }

    private loadShells(lookups: IConfigLookup[], loadDefaults: boolean): object[] {
        // Here we run the lookup against all the shells.
        // All shells should execute, shell are not fallback chains!

        // Shells are already sorted by priority so we can just map.
        return this._shells.map(({shell}) => this.loadShell(shell, lookups, loadDefaults));
    }
    
    private loadShell(shell: ILoaderShell, lookups: IConfigLookup[], loadDefaults: boolean) {
        let allLookups = loadDefaults ? [...shell.defaults, ...lookups ] : lookups;
        return allLookups
            .map(lookup => this.lookupSelect(shell, lookup))
            .filter(obj => obj !== null); // do not return nulls
    }

    private lookupSelect(shell: ILoaderShell, lookup: IConfigLookup): object {
        return shell.locator.locate(lookup) ||
               shell.fallbackLocator.locate(lookup) ||
               null; // BUG: there is no way to determine if the lookup is optional.
    }

    public addShell(shell: ILoaderShell, priority: number) {
        if (!shell)
            throw new KoalaError('shell must have a value');

        let nextIndex = _.findIndex(this._shells, ({ priority: x }) => (x >= priority));
        this._shells.splice(nextIndex - 1, 0, { priority: priority, shell });
    }

    public removeShell(shell: ILoaderShell) {
        if (!shell)
            throw new KoalaError('shell must have a value');

        let index = _.findIndex(this._shells, ({ shell: shx }) => shx === shell);
        this._shells.splice(index, 1);
    }

    public clearShells() {
        this._shells.splice(0, this._shells.length);
    }
}
