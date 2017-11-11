import { expect } from 'chai';

import ObjectConfigProvider from 'providers/ObjectConfigProvider';

describe('ObjectConfigProvider', () => {
    describe('#getConfig()', () => {
        it('return the source object', () => {
            const object = { key: 'value' };
            const provider = new ObjectConfigProvider(object);
            
            expect(provider.getConfig()).to.be.equal(object);
        });

        it.skip('keeps the source object immutable', () => {
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
