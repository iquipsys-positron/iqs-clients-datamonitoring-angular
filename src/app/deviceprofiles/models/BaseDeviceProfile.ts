import { SensorParameter } from './SensorParameter';
import { SensorEvent } from './SensorEvent';
import { ActuatorCommand } from './ActuatorCommand';
import { ConfigParameter } from './ConfigParameter';

export class BaseDeviceProfile {
    public id: string;
    public name: string;

    public modify_gateways: boolean;
    public multi_gateways: boolean;
    public gateways?: string[];

    public modify_params: boolean;
    public config_params: boolean;
    public rename_params: boolean;
    public params?: SensorParameter[];

    public modify_events: boolean;
    public config_events: boolean;
    public rename_events: boolean;
    public events?: SensorEvent[];

    public modify_commands: boolean;
    public config_commands: boolean;
    public rename_commands: boolean;
    public commands?: ActuatorCommand[];

    public modify_config: boolean;
    public config_config: boolean;
    public rename_config: boolean;
    public config?: ConfigParameter[];
}
