import { SensorParameterAlgorithm } from './SensorParameterAlgorithm';
import { ValueType } from './ValueType';
import { ValueUnit } from './ValueUnit';

export class SensorParameterType {
    id: number;
    name: string;
    algorithm: SensorParameterAlgorithm;
    value_type?: ValueType;
    value_unit?: ValueUnit;
    min_value?: number;
    max_value?: number;
}
