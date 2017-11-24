import * as fs from 'fs';

import { IConfigProvider } from './ConfigProvider';

import ConfigTree, { objectToTree } from 'config/ConfigTree';

export default class JsonConfigProvider implements IConfigProvider {
    private readonly _json: string;
    private readonly _jsonAsPath: boolean;

    private constructor(json: string, isPath: boolean) {
        this._json = json;
        this._jsonAsPath = isPath;
    }

    public getConfig(): ConfigTree {
        return objectToTree(this.getRawConfig());
    }

    public getRawConfig(): any {
        const json = this._jsonAsPath 
            ? JsonConfigProvider.readFile(this._json)
            : this._json;

        return JsonConfigProvider.getConfigFromJson(json);
    }

    public static fromFile(filePath: string): JsonConfigProvider {
        return new JsonConfigProvider(filePath, true);
    }

    public static fromJson(jsonText: string): JsonConfigProvider {
        return new JsonConfigProvider(jsonText, false);
    }

    private static getConfigFromJson(json: string): any {
        return JSON.parse(json);
    }

    private static readFile(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }
}
