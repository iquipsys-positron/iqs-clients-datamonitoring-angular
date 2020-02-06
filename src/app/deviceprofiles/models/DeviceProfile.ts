import { SensorParameter } from './SensorParameter';
import { SensorEvent } from './SensorEvent';
import { ActuatorCommand } from './ActuatorCommand';
import { ConfigParameter } from './ConfigParameter';

export class DeviceProfile {
    public id: string;
    public organization_id: string;
    public base_profile_id: string;
    public name: string;
    public gateways?: string[];
    public params?: SensorParameter[];
    public events?: SensorEvent[];
    public commands?: ActuatorCommand[];
    public config?: ConfigParameter[];
}
