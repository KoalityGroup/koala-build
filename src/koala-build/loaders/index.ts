import { IBuildInfo } from '../KoalaBuild';
import { IConfigLookup } from '../locators/configLookup';

import ConfigTree from 'config/ConfigTree';

export interface IConfigLoader {
    loadSeeds(buildInfo: IBuildInfo): ConfigTree[];
    loadPartial(lookup: IConfigLookup): ConfigTree[];
}
