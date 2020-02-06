import { EntityState } from 'iqs-libs-clientshell2-angular';
import { fromJS } from 'immutable';

import { DeviceprofilesAction, DeviceprofilesActionType } from './deviceprofiles.actions';
import { DeviceprofilesState } from './deviceprofiles.state';

export const deviceprofilesInitialState: DeviceprofilesState = {
    base: [],
    profiles: [],
    state: EntityState.Empty,
    error: null,
};

export function deviceprofilesReducer(
    state = deviceprofilesInitialState,
    action: DeviceprofilesAction
): DeviceprofilesState {

    switch (action.type) {
        case DeviceprofilesActionType.DeviceprofilesInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesSuccess: {
            let map = fromJS(state);
            map = map.set('base', action.payload.base);
            map = map.set('profiles', action.payload.profiles);
            map = map.set('state', action.payload.profiles && action.payload.profiles.length ? EntityState.Data : EntityState.Empty);
            map = map.set('loading', false);
            map = map.set('error', null);
            return <DeviceprofilesState>map.toJS();
        }

        case DeviceprofilesActionType.DeviceprofilesFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return <DeviceprofilesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
