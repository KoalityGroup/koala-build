import { expect } from 'chai';

import ObjectConfigProvider from 'providers/ObjectConfigProvider';

describe('ObjectConfigProvider', () => {
    describe('#getConfig()', () => {
        it('return the source object', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);

            expect(provider.getConfig()).to.be.deep.equal(object);
        });

        it('has proper deep clone of the object', () => {
            const object = { key: { key: { key: { key: 'value' } } } };
            const provider = new ObjectConfigProvider(object);

            expect(provider.getConfig()).to.be.deep.equal(object);
        });

        it('maintains the source object reference', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);

            expect(provider.getConfig()).to.be.deep.equal(object);

            object.key = 'another value';
            expect(provider.getConfig()).to.be.deep.equal(object);
        });

        it('keeps the source object immutable', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);
            
            let objectFromProvider = provider.getConfig() as any;
            let otherObjectFromProvider = provider.getConfig() as any;
            otherObjectFromProvider.key = 'new-value';

            expect(objectFromProvider.key).equals('value');
            expect(object.key).equals('value');
        });
    });
});
