import ConfigTree from 'config/ConfigTree';

export interface IConfigProvider {
    getConfig(): ConfigTree;
}
