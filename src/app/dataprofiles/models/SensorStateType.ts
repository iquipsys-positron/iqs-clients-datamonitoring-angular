import { SensorStateAlgorithm } from './SensorStateAlgorithm';

export class SensorStateType {
    id: number;
    name: string;
    algorithm: SensorStateAlgorithm;
    param_id?: number;
    command_id?: number;
    event_id?: number;
    on_event_id?: number;
    off_event_id?: number;
    value_min?: number;
    value_max?: number;
}
