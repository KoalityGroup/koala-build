import { IConfigLocator } from 'locators/ConfigLocator';
import { IConfigLookup } from 'locators/configLookup';
import { IConfigProvider } from 'providers/ConfigProvider';

export default class VoidLocator implements IConfigLocator {
    public locate(lookup: IConfigLookup): IConfigProvider {
        return null;
    }
}