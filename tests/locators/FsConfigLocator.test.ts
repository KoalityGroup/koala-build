import { expect } from 'chai';
import * as _ from 'lodash';

import KoalaError from 'KoalaError';
import Locator from 'locators/FsConfigLocator';

import configLookup, { LookupObject } from 'locators/configLookup';

import { CONFIG_PATH, formatLookup } from '../common';

function alwaysOne() {
    return 1;
}

function ctorWrapper(lpath: string) {
    return new Locator(lpath);
}

describe('FsConfigLocator', () => {
    describe('#constructor()', () => {
        it('throws if path is not absolute', () => {
            expect(() => ctorWrapper('./rel')).to.throw(KoalaError);
        });

        it('throws if path does not exists', () => {
            expect(() => ctorWrapper('J:/invalid/path')).to.throw(KoalaError);
        });

        it('not throws with valid path', () => {
            expect(() => ctorWrapper(CONFIG_PATH)).to.not.throw();
        });
    });

    describe('#locate()', () => {
        let locator: Locator;

        const testMatrix = [
            { lookup: configLookup(LookupObject.Environment, 'production'), ext: true },
            { lookup: configLookup(LookupObject.Configuration, 'debug'), ext: true },
            { lookup: configLookup(LookupObject.TargetArch, 'x86'), ext: true },
            { lookup: configLookup(LookupObject.TargetOs, 'Windows'), ext: true },
            { lookup: configLookup(LookupObject.TargetHost, 'Chrome'), ext: true },
            { lookup: configLookup(LookupObject.Option, 'silent'), ext: true },
            { lookup: configLookup(LookupObject.Fragment, 'no-lint'), ext: true },
            { lookup: configLookup(LookupObject.Baseline, 'default'), ext: true },

            { lookup: configLookup(LookupObject.Configuration, 'fake'), ext: false }
        ];

        beforeEach(() => {
            locator = new Locator(CONFIG_PATH);
        });

        // tslint:disable-next-line:ban
        testMatrix.forEach(test => {
            const desc = test.ext
                ? `satisfy lookup [${formatLookup(test.lookup)}]`
                : `not satisfy lookup [${formatLookup(test.lookup)}]`;

            it(desc, () => {
                if (test.ext)
                    expect(locator.locate(test.lookup)).to.not.be.null;
                else 
                    expect(locator.locate(test.lookup)).to.be.null;
            });
        });
    });
});
