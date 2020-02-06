import { ActuatorCommandAlgorithm } from './ActuatorCommandAlgorithm';

export class ActuatorCommandType {
    id: number;
    name: string;
    algorithm?: ActuatorCommandAlgorithm;
    value_type?: string;
    value_unit?: string;
    min_value?: number;
    max_value?: number;
}
