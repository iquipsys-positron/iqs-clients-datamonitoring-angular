export enum SensorEventType {
    Button1ShortPressed = 1,
    Button1LongPressed = 2,
    Button2ShortPressed = 3,
    Button2LongPressed = 4,
    Button3Pressed = 5,
    Button4Pressed = 6
}

export class SensorEvent {
    public id?: number;
    public name?: string;
    public type?: number;
    public offset?: number;
    public scale?: number;
    public min_value?: number;
    public max_value?: number;
}
