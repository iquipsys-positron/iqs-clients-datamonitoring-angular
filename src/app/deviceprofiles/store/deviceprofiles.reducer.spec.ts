import { EntityState } from 'iqs-libs-clientshell2-angular';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import cloneDeep from 'lodash/cloneDeep';

import * as fromDeviceprofilesActions from './deviceprofiles.actions';
import { deviceprofilesInitialState, deviceprofilesReducer } from './deviceprofiles.reducer';
import { DeviceProfile, BaseDeviceProfile } from '../models/index';
import { utils } from '../../../mock';

describe('[Deviceprofiles] store/reducer', () => {

    let baseDeviceprofiles: BaseDeviceProfile[];
    let deviceprofiles: DeviceProfile[];

    beforeEach(() => {
        resetToCurrentDefault();
        baseDeviceprofiles = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        deviceprofiles = cloneDeep(utils.deviceprofiles.findByOrganizationId('00000000000000000000000000000000'));
    });

    it('should have initial state', () => {
        expect(deviceprofilesReducer(undefined, { type: null })).toEqual(deviceprofilesInitialState);
        expect(deviceprofilesReducer(deviceprofilesInitialState, { type: null })).toEqual(deviceprofilesInitialState);
    });

    it('should reduce deviceprofiles states', () => {
        const joc = jasmine.objectContaining;
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            error: 'error',
            state: EntityState.Error
        }, new fromDeviceprofilesActions.DeviceprofilesInitAction()))
            .toEqual(joc({ error: null, state: EntityState.Progress }));
        expect(deviceprofilesReducer({
            ...deviceprofilesInitialState,
            error: 'error'
        },
            new fromDeviceprofilesActions.DeviceprofilesSuccessAction({ base: baseDeviceprofiles, profiles: deviceprofiles })))
            .toEqual(joc({ base: baseDeviceprofiles, profiles: deviceprofiles, error: null }));
        expect(deviceprofilesReducer(deviceprofilesInitialState,
            new fromDeviceprofilesActions.DeviceprofilesFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error' }));
    });

});
