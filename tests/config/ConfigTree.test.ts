import { expect } from 'chai';

import KoalaError from 'KoalaError';

import ConfigNode from 'config/ConfigNode';
import ConfigTree, { objectToTree } from 'config/ConfigTree';

describe('ConfigTree', () => {
    describe('#toObject()', () => {
        const T = (func: (node: ConfigNode) => void) => {
            const tree = new ConfigTree();
            func(tree.root);

            return tree;
        };

        const testSubjects = [
            { 
                obj: { a: 'value' }, 
                tree: T(x => x.addChild('a').setValue('value')) 
            },
            {   
                obj: { a: 'value', b: 'other' }, 
                tree: T(x => x.addChild('a').setValue('value').parent.addChild('b').setValue('other')) 
            },
            {   
                obj: { a: { b: 'other' } }, 
                tree: T(x => x.addChild('a').addChild('b').setValue('other')) 
            }
        ];

        let i = 1;
        for (const testSubject of testSubjects) {
            it(`test subject #${i++}`, () => {
                const target = testSubject.obj;
                const source = testSubject.tree.toObject();

                expect(source).to.deep.equal(target);
            });
        }
    });
});
