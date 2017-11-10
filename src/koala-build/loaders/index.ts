import { IBuildInfo } from '../KoalaBuild';
import { IConfigLookup } from '../locators/configLookup';

export interface IConfigLoader {
    loadSeeds(buildInfo: IBuildInfo): object[];
    loadPartial(lookup: IConfigLookup): object[];
}
