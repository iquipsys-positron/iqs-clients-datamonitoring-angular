import { EntityState } from 'iqs-libs-clientshell2-angular';

import {
    DeviceprofilesState,
    getDeviceprofilesBase,
    getDeviceprofilesData,
    getDeviceprofilesState,
    getDeviceprofilesError,
} from './deviceprofiles.state';
import { utils } from '../../../mock';

const createDeviceprofilesState = ({
    base = [],
    profiles = [],
    state = EntityState.Empty,
    error = 'error',
} = {}): DeviceprofilesState => ({
    base,
    profiles,
    state,
    error,
});

describe('[Deviceprofiles] store/state', () => {

    it('getDeviceprofilesBase', () => {
        const state = createDeviceprofilesState({ base: utils.deviceprofiles.getBaseDeviceProfiles() });
        expect(getDeviceprofilesBase.projector(state)).toEqual(state.base);
    });

    it('getDeviceprofilesData', () => {
        const state = createDeviceprofilesState({
            profiles: utils.deviceprofiles
                .findByOrganizationId('00000000000000000000000000000000')
        });
        expect(getDeviceprofilesData.projector(state)).toEqual(state.profiles);
    });

    it('getDeviceprofilesState', () => {
        const state = createDeviceprofilesState({ state: EntityState.Error });
        expect(getDeviceprofilesState.projector(state)).toEqual(state.state);
    });

    it('getDeviceprofilesError', () => {
        const state = createDeviceprofilesState();
        expect(getDeviceprofilesError.projector(state)).toEqual(state.error);
    });

});
