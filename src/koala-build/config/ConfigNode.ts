import ConfigTree, { IConfigNodeSet } from 'config/ConfigTree';
import ManagedConfigNodeSet from 'config/ManagedConfigNodeSet';

export default class ConfigNode {
    private _tree: ConfigTree;
    private _parent: ConfigNode;

    private _value: any;
    private _children: ManagedConfigNodeSet;

    constructor(tree: ConfigTree, parent: ConfigNode = null) {
        this._tree = tree;
        this._parent = parent;

        this._children = new ManagedConfigNodeSet();
    }

    public setValue(newValue: any) {
        this._value = newValue;

        return this;
    }

    public getValue() {
        return this._value;
    }

    public addChild(key: string) {
        let newChild = new ConfigNode(this._tree, this);
        this.setChild(key, newChild);

        return newChild;
    }

    public setChild(key: string, node: ConfigNode) {
        this._children.setNode(key, node);

        return node;
    }

    public hasChild(key: string) {
        return this._children.hasNode(key);
    }

    public getChild(key: string) {
        return this._children.getNode(key);
    }

    public tryGetChild(key: string) {
        return this.hasChild(key) ? this._children.getNode(key) : undefined;
    }

    public hasChildren() {
        return this._children.count > 0;
    }

    public getRoot(): ConfigNode {
        if (this.isRoot)
            return this;

        return this._parent.getRoot();
    }

    public toObject(): any {
        if (!this.hasChildren())
            return this.getValue();

        const root: any = {};
        for (const childKey in this.children) {
            if (this.children.hasOwnProperty(childKey)) {
                const child = this.children[childKey];
                root[childKey] = child.toObject();
            }
        }

        return root;
    }

    public get isRoot() {
        return this._parent === null;
    }

    public get hasParent() {
        return !this.isRoot;
    }

    public get graph() {
        return this._tree;
    }

    public get parent() {
        return this._parent;
    }

    public get children() {
        return this._children.getSet();
    }
}
