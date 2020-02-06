import { ActuatorCommandType } from './ActuatorCommandType';
import { SensorEventType } from './SensorEventType';
import { SensorParameterType } from './SensorParameterType';
import { SensorStateType } from './SensorStateType';

export class DataProfile {
    id: string;
    param_types?: SensorParameterType[];
    event_types?: SensorEventType[];
    command_types?: ActuatorCommandType[];
    state_types?: SensorStateType[];
}
