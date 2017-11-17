import { IConfigLocator } from 'locators/ConfigLocator';
import { IConfigLookup, LookupObject } from 'locators/configLookup';
import { IConfigProvider } from 'providers/ConfigProvider';
import ObjectConfigProvider from 'providers/ObjectConfigProvider';

function stringifyKey(lookup: IConfigLookup) {
    return `${LookupObject[lookup.object]}/${lookup.objectName}`;
}

export default class LookupLocator implements IConfigLocator {
    private obj: any;

    constructor(list: Array<{key: IConfigLookup, value: any}>) {
        this.obj = {};
        for (const item of list) {
            this.obj[stringifyKey(item.key)] = item.value;
        }
    }

    public locate(lookup: IConfigLookup): IConfigProvider {
        const key = stringifyKey(lookup);
        if (this.obj.hasOwnProperty(key))
            return new ObjectConfigProvider(this.obj[key]);

        return null;
    }

}