import { expect } from 'chai';
import * as path from 'path';

import LayeredJsonConfigProvider from 'providers/LayeredJsonConfigProvider';

import { CONFIG_PATH } from '../common';

describe('LayeredJsonConfigProvider', () => {
    describe.skip('#getConfig()', () => {
        const layersPath = path.join(CONFIG_PATH, 'misc/layered-json');
        const provider = new LayeredJsonConfigProvider(layersPath);

        it('reads layers from disk', () => {
            const resultJson = provider.getConfig() as any;

            expect(resultJson).to.have.any.keys('i-have-index');
            expect(resultJson['i-have-index']).be.equal(true);
        });

        it('merge object from all sources', () => {
            const resultJson = provider.getConfig() as any;

            expect(resultJson['sub-layer']).to.have.all.keys(
                ['from-named-dir', 'from-index', 'from-named-json']
            );
        });

        it('named directories keys override named json keys', () => {
            const resultJson = provider.getConfig() as any;

            expect(resultJson.overrides).to.have.all.keys('value-to-override');
            expect(resultJson.overrides['value-to-override']).to.equal('ok');
        });
    });
});
