import * as path from 'path';

import * as glob from 'glob';
import * as _ from 'lodash';

import { IConfigProvider } from './ConfigProvider';
import JsonConfigProvider from './JsonConfigProvider';

function importLayeredJson(fileNameFragment: string, baseDir: string, pf: (path: string) => IConfigProvider) {
    const layers = parseLayers(fileNameFragment);
    let actuallFileName = path.resolve(baseDir, fileNameFragment);

    let provider = pf(actuallFileName);
    let tailObject = provider.getConfig();

    let currentObject = tailObject;
    for (let layer of layers.reverse()) {
        let newObject: any = { };
        newObject[layer] = currentObject;

        currentObject = newObject;
    }

    return currentObject;
}

function parseLayers(fragment: string) {
    const fragmentPath = path.normalize(fragment);
    const layers = fragmentPath.split(path.sep);
    layers.splice(layers.length - 1);

    const fileName = path.parse(fragmentPath).name;
    if (fileName.toLowerCase() !== 'index')
        layers.push(fileName);

    return layers;
}

export default class LayeredJsonConfigProvider implements IConfigProvider {
    private readonly _baseDirectory: string;

    constructor(baseDirectory: string) {
        this._baseDirectory = baseDirectory;
    }

    public getConfig(): any {
        const pf = (jpath: string) => JsonConfigProvider.fromFile(jpath);
        let subfiles = glob.sync('**/*.json', { cwd: this._baseDirectory });

        let mergeTarget = { };
        for (let subfile of subfiles) {
            _.merge(mergeTarget, importLayeredJson(subfile, this._baseDirectory, pf));
        }

        return mergeTarget;
    }
}
