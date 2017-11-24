import { expect } from 'chai';

import ObjectConfigProvider from 'providers/ObjectConfigProvider';

describe('ObjectConfigProvider', () => {
    describe('#getConfig()', () => {
        it('return the source object', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);
            const configNode = provider.getConfig().root;

            expect(configNode.hasChild('key')).is.true;
        });

        it('has proper deep clone of the object', () => {
            const object = { key: { key: { key: { key: 'value' } } } };
            const provider = new ObjectConfigProvider(object);
            const configNode = provider.getConfig().root
                .getChild('key').getChild('key').getChild('key').getChild('key');

            expect(configNode.getValue()).equals('value');
        });

        it('maintains the source object reference', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);

            expect(provider.getConfig().root.getChild('key').getValue())
                .equals(object.key);

            object.key = 'another value';
            expect(provider.getConfig().root.getChild('key').getValue())
                .equals(object.key);
        });
    });
});
