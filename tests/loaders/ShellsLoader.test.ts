import { expect } from 'chai';
import * as _ from 'lodash';

import { IBuildInfo, ITargetInfo } from 'KoalaBuild';
import KoalaError from 'KoalaError';

import ShellsLoader, { createShell, ILoaderShell } from 'loaders/ShellsLoader';
import configLookup, { LookupObject } from 'locators/configLookup';

import { makeBuildInfo } from '../common';
import LookupLocator from '../mocks/LookupLocator';

describe('ShellsLoader', () => {
    describe('#addShell()', () => {
        it('throws with empty shell', () => {
            const loader = new ShellsLoader();

            expect(() => loader.addShell(null, 0)).to.throw(KoalaError);
        });

        it('adds shells to collection', () => {
            const loader = new ShellsLoader();

            expect(loader.getShells()).to.have.lengthOf(0);

            // tslint:disable-next-line:no-object-literal-type-assertion
            let fakeShell = {} as ILoaderShell;
            loader.addShell(fakeShell, 0);

            expect(loader.getShells()).to.have.lengthOf(1);
        });

        (function shellsSort(breakpoints: number, step: number, tests: number) {
            let testShells = _.range(0, breakpoints)
                .map(x => x * step)
                // tslint:disable-next-line:no-object-literal-type-assertion
                .map(x => ({x, s: { name: `X: ${x}` } as ILoaderShell }));

            let baseRange = _.range(0, breakpoints);
            let testAdds = _.range(0, tests).map(i => ({ i, adds: _.shuffle(baseRange) }));
            
            for (const addTest of testAdds) {
                let testName = `sorts shells by priority (order ${addTest.i + 1})`;
                it(`${testName} [${addTest.adds.join(', ')}]` , () => {
                    const loader = new ShellsLoader();

                    for (const add of addTest.adds) {
                        let shell = testShells[add];
                        loader.addShell(shell.s, shell.x);
                    }
        
                    for (let i = 0; i < testShells.length; i++) {
                        let shell = testShells[testShells.length - i - 1];
                        expect(loader.getShells()[i]).equals(shell.s);
                    }
                });
            }
        })(10, 10, 10);
    });

    describe('#clearShells()', () => {
        it('clears all shells', () => {
            const loader = new ShellsLoader();

            // tslint:disable-next-line:no-object-literal-type-assertion
            let fakeShell = {} as ILoaderShell;
            loader.addShell(fakeShell, 0);
            loader.clearShells();

            expect(loader.getShells()).to.have.lengthOf(0);
        });
    });

    describe('#removeShell()', () => {
        it('removes shells by instance', () => {
            const loader = new ShellsLoader();

            // tslint:disable-next-line:no-object-literal-type-assertion
            let fakeShell = {} as ILoaderShell;
            // tslint:disable-next-line:no-object-literal-type-assertion
            let otherShell = {} as ILoaderShell;
            loader.addShell(fakeShell, 0);
            loader.addShell(otherShell, 0);

            loader.removeShell(fakeShell);

            expect(loader.getShells()).to.have.lengthOf(1);
            expect(loader.getShells()[0]).to.equal(otherShell);
        });
    });

    describe('#loadSeeds()', () => {
        const loader = new ShellsLoader();

        const lookups = {
            voidLookup: configLookup(LookupObject.Option, 'void'),
            testConfig: configLookup(LookupObject.Configuration, 'test-config'),
            testDefaults: configLookup(LookupObject.Baseline, 'test-defaults')
        };

        const locator = new LookupLocator([
            { key: lookups.testConfig, value: { subject: 'configuration' } },
            { key: lookups.testDefaults, value: { fromDefault: true } },
        ]);

        const shells = {
            default: createShell('default', locator, []),
            onlyDefaultsShell: createShell('only-defaults', locator, [lookups.testDefaults])
        };

        const buildInfo = {
            default: makeBuildInfo('Production,Release,x86,Any,Node'),
            configuration: makeBuildInfo('__none__,test-config,__none__,__none__,__none__'),
            none: makeBuildInfo('__none__,__none__,__none__,__none__,__none__')
        };

        beforeEach(() => {
            loader.clearShells();
        });

        it('loads shells defaults', () => {
            loader.addShell(shells.onlyDefaultsShell, 0);
            
            let seeds = loader.loadSeeds(buildInfo.none);

            expect(seeds).to.have.lengthOf(1);
            expect(seeds[0].root.hasChild('fromDefault')).is.true;
        });

        it('loads configuration in build string', () => {
            loader.addShell(shells.default, 0);
            
            let seeds = loader.loadSeeds(buildInfo.configuration);

            expect(seeds).to.have.lengthOf(1);
            expect(seeds[0].root.hasChild('subject')).is.true;
            expect(seeds[0].root.getChild('subject').getValue()).equals('configuration');
        });
    });

    describe.skip('#loadPartial()', () => {
        it.skip('does not load defaults', () => {
            return;
        });
    });
});
