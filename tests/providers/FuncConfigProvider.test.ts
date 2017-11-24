import { expect } from 'chai';

import FuncConfigProvider from 'providers/FuncConfigProvider';

describe('FuncConfigProvider', () => {
    describe('#getConfig()', () => {
        it('return the result of the source function', () => {
            const func = () => ({ a: 'hello world' });
            const provider = new FuncConfigProvider(func);
            
            expect(provider.getConfig().root.hasChild('a')).is.true;
        });

        it('invokes the function every time', () => {
            function func(init: number) {
                let counter = init;
                return () => {
                    return { b: counter++ };
                };
            }

            const provider = new FuncConfigProvider(func(0));
            const firstTime = provider.getConfig();
            const secondTime = provider.getConfig();

            expect(firstTime.root.hasChild('b')).is.true;
            expect(firstTime.root.getChild('b').getValue()).to.equal(0);

            expect(secondTime.root.hasChild('b')).is.true;
            expect(secondTime.root.getChild('b').getValue()).to.equal(1);
        });
    });
});
