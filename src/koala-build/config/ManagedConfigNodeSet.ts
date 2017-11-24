import ConfigNode from 'config/ConfigNode';
import { IConfigNodeSet } from 'config/ConfigTree';
import KoalaError from 'KoalaError';

export default class ManagedConfigNodeSet {
    private _set: IConfigNodeSet;
    private _nodeCount: number;

    constructor() {
        this._set = {};
        this._nodeCount = 0;
    }

    public setNode(key: string, node: ConfigNode): void {
        let isAdd = !this.hasNode(key);
        
        this._set[key] = node;
        if (isAdd)
            this._nodeCount += 1;
    }

    public deleteNode(key: string) {
        if (!this.hasNode(key))
            return;

        delete this._set[key];
        this._nodeCount -= 1;
    }

    public hasNode(key: string) {
        return this._set.hasOwnProperty(key) &&
               this._set[key] !== undefined;
    }

    public getNode(key: string) {
        if (!this.hasNode(key))
            throw new KoalaError('node set does not contain requested key');

        return this._set[key];
    }

    public getSet() {
        return this._set;
    }

    public get count() {
        return this._nodeCount;
    }
}
