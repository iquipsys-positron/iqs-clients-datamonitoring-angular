import { SensorEventAlgorithm } from './SensorEventAlgorithm';

export class SensorEventType {
    id: number;
    name: string;
    algorithm: SensorEventAlgorithm;
    value_type?: string;
    value_unit?: string;
    min_value?: number;
    max_value?: number;
}
