export enum LookupObject {
    Environment = 'ENVIRONMENT',
    Configuration = 'CONFIGURATION',
    TargetOs = 'TARGETOS',
    TargetArch = 'TARGETARCH',
    TargetHost = 'TARGETHOST',
    Option = 'OPTION',
    Fragment = 'FRAGMENT',
    Baseline = 'BASELINE'
}

export interface IConfigLookup {
    object: LookupObject;
    objectName: string;
}

export default function configLookup(object: LookupObject, name: string): IConfigLookup {
    return { object, objectName: name };
}
