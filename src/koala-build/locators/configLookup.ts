export enum LookupObject {
    Environment,
    Configuration,
    TargetOs,
    TargetArch,
    TargetHost,
    Option,
    Fragment,
    Baseline
}

export interface IConfigLookup {
    object: LookupObject;
    objectName: string;
}

export default function configLookup(object: LookupObject, name: string): IConfigLookup {
    return { object, objectName: name };
}
