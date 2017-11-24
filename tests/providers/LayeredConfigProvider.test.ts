import { expect } from 'chai';
import * as path from 'path';

import LayeredJsonConfigProvider from 'providers/LayeredJsonConfigProvider';

import { CONFIG_PATH } from '../common';

describe('LayeredJsonConfigProvider', () => {
    describe('#getConfig()', () => {
        const layersPath = path.join(CONFIG_PATH, 'misc/layered-json');
        const provider = new LayeredJsonConfigProvider(layersPath);

        it('reads layers from disk', () => {
            const configTree = provider.getConfig();

            expect(configTree.root.hasChild('i-have-index')).is.true;
            expect(configTree.root.getChild('i-have-index').getValue()).is.true;
        });

        it('merge object from all sources', () => {
            const configTree = provider.getConfig();
            const subLayer = configTree.root.getChild('sub-layer');

            for (let key of ['from-named-dir', 'from-index', 'from-named-json'])
                expect(subLayer.hasChild(key)).is.true;
        });

        it('named directories keys override named json keys', () => {
            const configTree = provider.getConfig();
            const configNode = configTree.root
                .getChild('overrides')
                .getChild('value-to-override');

            expect(configNode.getValue()).to.equal('ok');
        });
    });
});
