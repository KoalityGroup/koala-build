import * as _ from 'lodash';

import KoalaError from '../KoalaError';
import { IConfigProvider } from './ConfigProvider';

import ConfigTree, { objectToTree } from 'config/ConfigTree';

export default class ObjectConfigProvider implements IConfigProvider {
    private readonly _configObj: object;

    constructor(configObj: object) {
        if (!configObj)
            throw new KoalaError('configObj must be have a value');

        this._configObj = configObj;
    }

    public getConfig(): ConfigTree {
        return objectToTree(_.cloneDeep(this._configObj));
    }
}
