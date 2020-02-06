export enum SensorParameterType {
    TravelDistance = 1,
    TravelSpeed = 2,
    Powered = 3,
    Freezed = 4,
    Immobile = 5,
    LoadLevel = 6,
    GasLevel = 7
}

export class SensorParameter {
    public id?: number;
    public name?: string;
    public type?: number;
    public offset?: number;
    public scale?: number;
    public min_value?: number;
    public max_value?: number;
}
