import KoalaError from '../KoalaError';
import { IConfigProvider } from './ConfigProvider';

import ConfigTree, { objectToTree } from 'config/ConfigTree';

export default class FuncConfigProvider implements IConfigProvider {
    private readonly _func: () => object;

    constructor(configFunc: () => object) {
        if (!configFunc)
            throw new KoalaError('configFunc must be a valid function');

        this._func = configFunc;
    }

    public getConfig(): ConfigTree {
        return objectToTree(this._func());
    }
}
