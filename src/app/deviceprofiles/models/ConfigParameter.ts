export enum ConfigParameterType { }

export class ConfigParameter {
    public id?: number;
    public name?: string;
    public type?: number;
    // public offset?: number;
    // public scale?: number;
    public min_value?: number;
    public max_value?: number;
}
