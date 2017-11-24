import { expect } from 'chai';
import { objectToTree } from 'config/ConfigTree';
import KoalaError from 'KoalaError';


describe('objectToTree', () => {
    it('returns empty tree for null object', () => {
        const testTree = objectToTree(null);
        expect(testTree).is.not.null;
        expect(testTree.root).is.not.null;
        expect(testTree.root.hasChildren()).is.false;
        expect(testTree.root.getValue()).is.undefined;
    });

    it('throws for non object types', () => {
        expect(() => objectToTree(1)).throws(KoalaError);
    });

    it('throws for undefined object', () => {
        expect(() => objectToTree(undefined)).throws(KoalaError);
    });

    it('maps object root to root node', () => {
        const testObject = { 'key-in-root': true };
        const testTree = objectToTree(testObject);

        expect(testTree.root.hasChild('key-in-root')).is.true;
    });

    it('maps terminal values to node values', () => {
        const testObject = { 'key-in-root': true };
        const testTree = objectToTree(testObject);

        expect(testTree.root.getChild('key-in-root').getValue()).is.true;
        expect(testTree.root.getChild('key-in-root').hasChildren()).is.false;
    });

    it('maps non-terminal values to sub-nodes', () => {
        const testObject = { 'key-in-root': { terminal: true } };
        const testTree = objectToTree(testObject);

        expect(testTree.root.getChild('key-in-root').hasChildren()).is.true;
    });

    it('does not map non-terminal values to values', () => {
        const testObject = { 'key-in-root': { terminal: true } };
        const testTree = objectToTree(testObject);

        expect(testTree.root.getChild('key-in-root').getValue()).is.undefined;
    });
});
