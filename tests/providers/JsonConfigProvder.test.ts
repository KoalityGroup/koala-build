import { expect } from 'chai';
import * as path from 'path';

import JsonConfigProvider from 'providers/JsonConfigProvider';

import { CONFIG_PATH } from '../common';

describe('JsonConfigProvider', () => {
    describe('#getConfig()', () => {
        it('reads contents from file', () => {
            const jsonPath = path.join(CONFIG_PATH, 'misc/known-state/index.json');
            const provider = JsonConfigProvider.fromFile(jsonPath);
            
            expect(provider.getConfig().root.hasChild('check')).is.true;
            expect(provider.getConfig().root.getChild('check').getValue()).is.true;
        });

        it('throws if file does not exists', () => {
            const jsonPath = path.join(CONFIG_PATH, 'misc/fake/index.json');
            const provider = JsonConfigProvider.fromFile(jsonPath);

            expect(() => provider.getConfig()).throws(Error);
        });

        it('reads contents from inline json', () => {
            const jsonString = `{ "some-key": 123 }`;
            const provider = JsonConfigProvider.fromJson(jsonString);

            expect(provider.getConfig().root.hasChild('some-key')).is.true;
            expect(provider.getConfig().root.getChild('some-key').getValue()).eq(123);
        });

        it('throws if inline json is invalid', () => {
            const jsonString = `some in valid json`;
            const provider = JsonConfigProvider.fromJson(jsonString);

            expect(() => provider.getConfig()).throws(Error);
        });
    });
});
