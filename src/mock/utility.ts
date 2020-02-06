import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import random from 'lodash/random';
import sampleSize from 'lodash/sampleSize';
import * as _moment from 'moment';

import { DataProfile, SensorParameterType, ValueType } from '../app/dataprofiles';
import { DeviceProfile, BaseDeviceProfile, SensorParameter } from '../app/deviceprofiles';
import {
    dataprofiles as storedDataprofiles,
    baseDeviceprofiles as storedBaseDeviceProfiles,
    deviceprofiles as storedDeviceprofiles,
    objectParams as storedObjectParams
} from './storage';
import { ObjectData } from '../app/datamonitoring/models';

const moment = _moment;

let lastDeviceprofileId = storedDeviceprofiles.length ? Number(storedDeviceprofiles[storedDeviceprofiles.length - 1].id) : 0;

export const dataprofiles = {
    findByOrganizationId: (organization_id: string): DataProfile => {
        return find(storedDataprofiles, ['id', organization_id]);
    },
    updateByOrganizationId: (organization_id: string, data: DataProfile): DataProfile => {
        let idx = findIndex(storedDataprofiles, ['id', organization_id]);
        if (idx < 0) {
            storedDataprofiles.push(data);
            idx = storedDataprofiles.length - 1;
        } else {
            storedDataprofiles[idx] = data;
        }
        localStorage.setItem('mockDataprofiles', JSON.stringify(storedDataprofiles));
        return storedDataprofiles[idx];
    }
};

export const deviceprofiles = {
    findByOrganizationId: (organization_id: string): DeviceProfile[] => {
        return storedDeviceprofiles.filter(dp => dp.organization_id === organization_id);
    },
    getBaseDeviceProfiles: (): BaseDeviceProfile[] => {
        return storedBaseDeviceProfiles;
    },
    findById: (organization_id: string, id: string): DeviceProfile => {
        return deviceprofiles.findByOrganizationId(organization_id).find(it => it.id === id);
    },
    create: (data: DeviceProfile): DeviceProfile => {
        lastDeviceprofileId++;
        data.id = lastDeviceprofileId.toString().padStart(32, '0');
        storedDeviceprofiles.push(data);
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return data;
    },
    update: (id: string, data: DeviceProfile): DeviceProfile => {
        const idx = storedDeviceprofiles.findIndex(dp => dp.id === id);
        if (idx < 0) { return null; }
        storedDeviceprofiles[idx] = data;
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return data;
    },
    delete: (id: string): DeviceProfile => {
        const idx = storedDeviceprofiles.findIndex(dp => dp.id === id);
        if (idx < 0) { return null; }
        const ret = storedDeviceprofiles.splice(idx, 1)[0];
        localStorage.setItem('mockDeviceprofiles', JSON.stringify(storedDeviceprofiles));
        return ret;
    }
};

export const datamonitoring = {
    generateRandomData: (organization_id: string, object_id: string, from_time: string, to_time: string): ObjectData[] => {
        const ret: ObjectData[] = [];
        const organizationDataProfile = dataprofiles.findByOrganizationId(organization_id);
        const organizationDeviceProfiles = deviceprofiles.findByOrganizationId(organization_id);
        let deviceProfile;
        if (!storedObjectParams.hasOwnProperty(object_id)) {
            deviceProfile = organizationDeviceProfiles.find(dp => dp.params && dp.params.length > 0);
            storedObjectParams[object_id] = {
                device_profile: deviceProfile.id,
                params: sampleSize(deviceProfile.params, random(1, deviceProfile.params.length))
                    .map(p => p.id)
            };
            localStorage.setItem('mockObjectParams', JSON.stringify(storedObjectParams));
        } else {
            deviceProfile = organizationDeviceProfiles.find(dp => dp.id === storedObjectParams[object_id].device_profile);
        }
        const objectParams: SensorParameter[] = deviceProfile.params.filter(p => storedObjectParams[object_id].params.includes(p.id));
        const objectParamsDataprofileMap: {
            [parameter_id: number]: SensorParameterType
        } = objectParams.reduce((acc: Object, val) => {
            const dpParam: SensorParameterType = organizationDataProfile.param_types.find(dp => dp.id === val.type);
            if (!dpParam) { return acc; }
            return { ...acc, [val.id]: dpParam };
        }, {});
        const date1 = moment(from_time);
        const dateAdd = date1.clone();
        const date2 = moment(to_time);
        if (date1.minutes() % 15) {
            const m = date1.minutes();
            if (m < 15) {
                date1.minutes(0).seconds(0).milliseconds(0);
            } else if (m < 30) {
                date1.minutes(15).seconds(0).milliseconds(0);
            } else if (m < 45) {
                date1.minutes(30).seconds(0).milliseconds(0);
            } else {
                date1.minutes(45).seconds(0).milliseconds(0);
            }
        }
        const diff = date2.diff(date1, 'm') / 15;
        const size = parseInt(Math.max(1, diff).toFixed(), 10);
        for (let i = 0; i < size; i++) {
            const data: ObjectData = {
                start_time: dateAdd.clone().toDate(),
                end_time: dateAdd.clone().add(15, 'm').toDate(),
                object_id,
                organization_id,
                values: []
            };
            const seconds = -1 * dateAdd.diff(i === size - 1 ? date2 : dateAdd.clone().add(15, 'm'), 's') / 2;
            for (let s = 0; s < seconds; s++) {
                const params = [];
                for (let idx = 0; idx < objectParams.length; idx++) {
                    const param = objectParams[idx];
                    const p = {
                        id: param.id,
                        typ: param.type,
                        val: random(1)
                    };
                    if (p.typ && objectParamsDataprofileMap[param.id]) {
                        switch (objectParamsDataprofileMap[param.id].value_type) {
                            case ValueType.Boolean: {
                                if (s === 0 || random(0, 1, true) < 0.001) {
                                    p.val = <boolean>random(1);
                                } else {
                                    p.val = data.values[data.values.length - 1].params[idx].val;
                                }
                                break;
                            }
                            case ValueType.Integer: {
                                const min = objectParamsDataprofileMap[param.id].min_value || 0;
                                const max = objectParamsDataprofileMap[param.id].max_value || 0;
                                if (s === 0 || random(0, 1, true) < 0.8) {
                                    p.val = <boolean>random(min, max);
                                } else {
                                    p.val = data.values[data.values.length - 1].params[idx].val;
                                }
                                break;
                            }
                            case ValueType.Float: {
                                const min = objectParamsDataprofileMap[param.id].min_value || 0;
                                const max = objectParamsDataprofileMap[param.id].max_value || 0;
                                if (s === 0 || random(0, 1, true) < 0.8) {
                                    p.val = <boolean>random(min, max, true);
                                } else {
                                    p.val = data.values[data.values.length - 1].params[idx].val;
                                }
                                break;
                            }
                        }
                    }
                    params.push(p);
                }
                data.values.push({
                    time: dateAdd.clone().toDate(),
                    params
                });
                dateAdd.add(2, 's');
            }
            ret.push(data);
        }
        return ret.reverse();
    }
};
