import ConfigNode from 'config/ConfigNode';
import KoalaError from 'KoalaError';

export default class ConfigTree {
    private _root: ConfigNode;

    constructor() {
        this._root = new ConfigNode(this);
    }

    public toObject(): any {
        return this._root.toObject();
    }

    public get root() {
        return this._root;
    }
}

export interface IConfigNodeSet {
    [key: string]: ConfigNode;
}

export function objectToTree(obj: any) {
    if (typeof obj !== 'object')
        throw new KoalaError('obj must be an object');

    const tree = new ConfigTree();
    if (obj === null)
        return tree;

    constructNode(tree.root, obj);
    return tree;
}

function constructNode(node: ConfigNode, nodeObject: any) {
    if (typeof nodeObject === 'object' && nodeObject !== null) {
        for (const key in nodeObject) {
            if (nodeObject.hasOwnProperty(key)) {
                const element = nodeObject[key];
                constructNode(node.addChild(key), element);
            }
        }
    } else {
        node.setValue(nodeObject);
    }
}
