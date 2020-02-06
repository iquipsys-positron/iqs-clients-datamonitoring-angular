export enum ActuatorCommandType {
    SoundSignal = 1, // Plays simple signals by code: 1, 2, 3, 4, 5...
}

export class ActuatorCommand {
    public id?: number;
    public name?: string;
    public type?: number;
    public offset?: number;
    public scale?: number;
    public min_value?: number;
    public max_value?: number;
}
