import { onReset } from 'iqs-libs-clientshell2-angular/mock';
import cloneDeep from 'lodash/cloneDeep';

import {
    DataProfile,
    SensorStateAlgorithm,
    ActuatorCommandAlgorithm,
    SensorEventAlgorithm,
    SensorParameterAlgorithm,
    ValueType,
    ValueUnit
} from '../app/dataprofiles';
import { DeviceProfile, BaseDeviceProfile } from 'src/app/deviceprofiles';

interface ObjectParams {
    [object_id: string]: {
        device_profile: string;
        params: Number[];
    };
}

const dataprofilesDefault: DataProfile[] = [
    {
        'state_types': [
            {
                'id': 1,
                'name': 'Powered',
                'algorithm': SensorStateAlgorithm.Duration,
                'param_id': 3
            },
            {
                'id': 2,
                'name': 'Freezed',
                'algorithm': SensorStateAlgorithm.Duration,
                'param_id': 4
            },
            {
                'id': 3,
                'name': 'Immobile',
                'algorithm': SensorStateAlgorithm.Utilization,
                'param_id': 5
            },
            {
                'id': 4,
                'name': 'Loaded',
                'algorithm': SensorStateAlgorithm.Utilization,
                'param_id': 6,
                'value_min': 50
            }
        ],
        'command_types': [
            {
                'id': 1,
                'name': 'sound_signal',
                'algorithm': ActuatorCommandAlgorithm.SoundSignal,
                'value_type': 'int',
                'min_value': 0,
                'max_value': 4
            }
        ],
        'event_types': [
            {
                'id': 1,
                'name': 'Button1 short pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            },
            {
                'id': 2,
                'name': 'Button1 long pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            },
            {
                'id': 3,
                'name': 'Button2 short pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            },
            {
                'id': 4,
                'name': 'Button2 long pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            },
            {
                'id': 5,
                'name': 'Button3 pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            },
            {
                'id': 6,
                'name': 'Button4 pressed',
                'algorithm': SensorEventAlgorithm.Custom,
                'value_type': 'bool'
            }
        ],
        'param_types': [
            {
                'min_value': 0,
                'algorithm': SensorParameterAlgorithm.Pressure,
                'name': 'Presure',
                'id': 109
            },
            {
                'id': 1,
                'name': 'Travel distance',
                'algorithm': SensorParameterAlgorithm.Count,
                'value_type': ValueType.Float,
                'value_unit': ValueUnit.km
            },
            {
                'id': 2,
                'name': 'Travel speed',
                'algorithm': SensorParameterAlgorithm.Statistics,
                'value_type': ValueType.Float,
                'value_unit': ValueUnit.kmH
            },
            {
                'id': 3,
                'name': 'Powered',
                'algorithm': SensorParameterAlgorithm.Custom,
                'value_type': ValueType.Boolean
            },
            {
                'id': 4,
                'name': 'Freezed',
                'algorithm': SensorParameterAlgorithm.Custom,
                'value_type': ValueType.Boolean
            },
            {
                'id': 5,
                'name': 'Immobile',
                'algorithm': SensorParameterAlgorithm.Custom,
                'value_type': ValueType.Boolean
            },
            {
                'id': 6,
                'name': 'Load level',
                'algorithm': SensorParameterAlgorithm.Transport,
                'value_type': ValueType.Float,
                'value_unit': ValueUnit.kg,
                'min_value': 0
            },
            {
                'id': 7,
                'name': 'Gas level',
                'algorithm': SensorParameterAlgorithm.Consumption,
                'value_type': ValueType.Float,
                'value_unit': ValueUnit.l,
                'min_value': 0
            }
        ],
        'id': '00000000000000000000000000000000'
    }
];
const baseDeviceprofilesDefault: BaseDeviceProfile[] = [
    {
        config_params: true,
        rename_config: true,
        config_commands: true,
        rename_params: true,
        modify_config: true,
        rename_commands: true,
        modify_params: true,
        name: 'Custom Profile',
        modify_commands: true,
        gateways: [
            'mqtt'
        ],
        modify_gateways: true,
        multi_gateways: true,
        config_events: true,
        rename_events: true,
        id: 'custom',
        modify_events: true,
        config_config: true
    },
    {
        config_params: false,
        rename_config: false,
        config_commands: false,
        params: [
            {
                id: 1,
                name: 'Powered',
                type: 3,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'Freezed',
                type: 4,
                min_value: 0,
                max_value: 1
            }
        ],
        rename_params: false,
        modify_config: false,
        commands: [
            {
                id: 1,
                name: 'Signal',
                type: 1,
                min_value: 0,
                max_value: 3
            }
        ],
        rename_commands: false,
        modify_params: false,
        name: 'Smartphone',
        modify_commands: false,
        gateways: [
            'mqtt'
        ],
        modify_gateways: false,
        multi_gateways: false,
        config_events: false,
        events: [
            {
                id: 1,
                name: 'ButtonPressed',
                type: 1,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'ButtonLongPressed',
                type: 2,
                min_value: 0,
                max_value: 1
            }
        ],
        rename_events: false,
        id: 'smartphone',
        modify_events: false,
        config_config: false
    },
    {
        config_params: true,
        rename_config: false,
        config_commands: false,
        params: [
            {
                id: 1,
                name: 'Powered',
                type: 3,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'Freezed',
                type: 4,
                min_value: 0,
                max_value: 1
            },
            {
                id: 3,
                name: 'Analog In',
                type: null
            }
        ],
        rename_params: true,
        modify_config: false,
        commands: [
            {
                id: 1,
                name: 'Signal',
                type: 1,
                min_value: 0,
                max_value: 3
            }
        ],
        rename_commands: false,
        modify_params: false,
        name: 'iQx',
        modify_commands: false,
        gateways: [
            'lora'
        ],
        modify_gateways: false,
        multi_gateways: false,
        config_events: false,
        events: [
            {
                id: 1,
                name: 'ButtonPressed',
                type: 1,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'ButtonLongPressed',
                type: 4,
                min_value: 0,
                max_value: 1
            }
        ],
        rename_events: false,
        id: 'iqx',
        modify_events: false,
        config_config: false
    },
    {
        config_params: true,
        rename_config: false,
        config_commands: true,
        params: [],
        rename_params: true,
        modify_config: false,
        commands: [],
        rename_commands: true,
        modify_params: true,
        name: 'Teltonika FMBx',
        modify_commands: true,
        gateways: [
            'teltonika'
        ],
        modify_gateways: false,
        multi_gateways: false,
        config_events: true,
        events: [],
        rename_events: true,
        id: 'teltonika_fmbx',
        modify_events: true,
        config_config: false
    }
];
const deviceprofilesDefault: DeviceProfile[] = [
    {
        config: [],
        params: [
            {
                id: 1,
                name: 'Powered',
                type: 3,
                min_value: 0,
                max_value: 1
            },
            {
                max_value: 1,
                min_value: 0,
                type: 4,
                name: 'Freezed',
                id: 2
            },
            {
                id: 3,
                name: 'Immobile',
                type: 5,
                min_value: 0,
                max_value: 1
            },
            {
                min_value: -200,
                type: 109,
                name: 'Presure',
                id: 9
            }
        ],
        commands: [],
        name: 'Sim1',
        gateways: [
            'rest',
            'mqtt'
        ],
        organization_id: '00000000000000000000000000000000',
        events: [
            {
                max_value: 1,
                type: 1,
                id: 1,
                name: 'ButtonPressed',
                min_value: 0
            },
            {
                max_value: 1,
                type: 2,
                id: 2,
                name: 'ButtonLongPressed',
                min_value: 0
            }
        ],
        id: '00000000000000000000000000000000',
        base_profile_id: 'custom'
    },
    {
        config: [],
        params: [],
        commands: [],
        name: 'Алекс',
        gateways: [
            'rest'
        ],
        organization_id: '00000000000000000000000000000000',
        events: [],
        id: '00000000000000000000000000000001',
        base_profile_id: 'iqx'
    },
    {
        config: [],
        params: [
            {
                id: 1,
                name: 'PAR 01',
                type: 6,
                min_value: 50
            }
        ],
        commands: [
            {
                id: 1,
                name: 'CMD 01',
                type: 1
            }
        ],
        name: 'Ret',
        gateways: [
            'mqtt',
            'lora'
        ],
        organization_id: '00000000000000000000000000000000',
        events: [
            {
                offset: 2,
                min_value: 11,
                type: 6,
                name: 'EVE 01',
                id: 1
            }
        ],
        id: '00000000000000000000000000000002',
        base_profile_id: 'custom'
    },
    {
        config: [],
        params: [
            {
                id: 1,
                name: 'Powered',
                type: 3,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'Freezed',
                type: 4,
                min_value: 0,
                max_value: 1
            }
        ],
        commands: [
            {
                id: 1,
                name: 'Signal',
                type: 1,
                min_value: 0,
                max_value: 3
            }
        ],
        name: 'Smart',
        gateways: [
            'mqtt'
        ],
        organization_id: '00000000000000000000000000000000',
        events: [
            {
                id: 1,
                name: 'ButtonPressed',
                type: 1,
                min_value: 0,
                max_value: 1
            },
            {
                id: 2,
                name: 'ButtonLongPressed',
                type: 2,
                min_value: 0,
                max_value: 1
            }
        ],
        id: '00000000000000000000000000000003',
        base_profile_id: 'smartphone'
    }
];
const objectParamsDefault: ObjectParams = {};

export let dataprofiles = JSON.parse(localStorage.getItem('mockDataprofiles')) || cloneDeep(dataprofilesDefault);
export let baseDeviceprofiles: BaseDeviceProfile[] = JSON.parse(localStorage.getItem('mockBaseDeviceprofiles'))
    || cloneDeep(baseDeviceprofilesDefault);
export let deviceprofiles: DeviceProfile[] = JSON.parse(localStorage.getItem('mockDeviceprofiles')) || cloneDeep(deviceprofilesDefault);
export let objectParams: ObjectParams = JSON.parse(localStorage.getItem('mockObjectParams')) || cloneDeep(objectParamsDefault);

export function resetToCurrentDefault(clearLs = true) {
    if (clearLs) { localStorage.clear(); }
    dataprofiles = cloneDeep(dataprofilesDefault);
    baseDeviceprofiles = cloneDeep(baseDeviceprofilesDefault);
    deviceprofiles = cloneDeep(deviceprofilesDefault);
    objectParams = cloneDeep(objectParamsDefault);
}

onReset.subscribe(() => {
    resetToCurrentDefault();
});
