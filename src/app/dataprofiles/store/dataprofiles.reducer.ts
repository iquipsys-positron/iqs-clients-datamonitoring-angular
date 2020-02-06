import { EntityState } from 'iqs-libs-clientshell2-angular';
import { fromJS } from 'immutable';

import { DataprofilesAction, DataprofilesActionType } from './dataprofiles.actions';
import { DataprofilesState } from './dataprofiles.state';

export const dataprofilesInitialState: DataprofilesState = {
    dataprofiles: null,
    state: EntityState.Empty,
    error: null,
};

export function dataprofilesReducer(
    state = dataprofilesInitialState,
    action: DataprofilesAction
): DataprofilesState {

    switch (action.type) {
        case DataprofilesActionType.DataprofilesInit: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <DataprofilesState>map.toJS();
        }

        case DataprofilesActionType.DataprofilesSuccess: {
            let map = fromJS(state);
            map = map.set('dataprofiles', action.payload.dataprofiles);
            map = map.set('state', action.payload.dataprofiles ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return <DataprofilesState>map.toJS();
        }

        case DataprofilesActionType.DataprofilesFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <DataprofilesState>map.toJS();
        }

        case DataprofilesActionType.DataprofilesUpdate: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return <DataprofilesState>map.toJS();
        }

        case DataprofilesActionType.DataprofilesUpdateSuccess: {
            let map = fromJS(state);
            map = map.set('dataprofiles', action.payload.dataprofiles);
            map = map.set('state', action.payload.dataprofiles ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return <DataprofilesState>map.toJS();
        }

        case DataprofilesActionType.DataprofilesUpdateFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return <DataprofilesState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
