import { expect } from 'chai';

import FuncConfigProvider from 'providers/FuncConfigProvider';

describe('FuncConfigProvider', () => {
    describe('#getConfig()', () => {
        it('return the result of the source function', () => {
            const func = () => ({ a: 'hello world' });
            const provider = new FuncConfigProvider(func);
            
            expect(provider.getConfig()).to.have.key('a');
        });

        it('invokes the function every time', () => {
            function func(init: number) {
                let counter = init;
                return () => {
                    return { b: counter++ };
                };
            }

            const provider = new FuncConfigProvider(func(0));
            const firstTime = provider.getConfig() as { b: number };
            const secondTime = provider.getConfig() as { b: number };

            expect(firstTime).to.have.key('b');
            expect(firstTime.b).to.equal(0);

            expect(secondTime).to.have.key('b');
            expect(secondTime.b).to.equal(1);
        });
    });
});
