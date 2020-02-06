import { EntityState } from 'iqs-libs-clientshell2-angular';

import {
    DataprofilesState,
    getDataprofilesData,
    getDataprofileParamById,
    getDataprofilesState,
    getDataprofilesError,
} from './dataprofiles.state';
import { DataProfile } from '../models/index';
import { dataprofiles as storedDataprofiles } from '../../../mock';

const createDataprofiles = ({
    id = '00000000000000000000000000000000',
    param_types = storedDataprofiles.param_types,
    event_types = storedDataprofiles.event_types,
    command_types = storedDataprofiles.command_types,
    state_types = storedDataprofiles.state_types
} = {}): DataProfile => ({
    id,
    param_types: param_types || [],
    event_types: event_types || [],
    command_types: command_types || [],
    state_types: state_types || []
});

const createDataprofilesState = ({
    dataprofiles = createDataprofiles(),
    state = EntityState.Data,
    error = 'custom error'
} = {}): DataprofilesState => ({
    dataprofiles,
    state,
    error
});

describe('[Dataprofiles] store/state', () => {

    it('getDataprofilesData', () => {
        const state = createDataprofilesState();
        expect(getDataprofilesData.projector(state)).toEqual(state.dataprofiles);
    });

    it('getDataprofileParamById', () => {
        const state = createDataprofilesState({
            dataprofiles: createDataprofiles({
                param_types: [
                    { id: 1 },
                    { id: 2 }
                ]
            })
        });
        expect(getDataprofileParamById.projector(state)).toEqual(null);
        expect(getDataprofileParamById.projector(state, {})).toEqual(null);
        expect(getDataprofileParamById.projector(null, { id: 1 })).toEqual(null);
        expect(getDataprofileParamById.projector({}, { id: 1 })).toEqual(null);
        expect(getDataprofileParamById.projector({ dataprofiles: {} }, { id: 1 })).toEqual(null);
        expect(getDataprofileParamById.projector({ dataprofiles: { param_types: [] } }, { id: 1 })).toEqual(null);
        expect(getDataprofileParamById.projector(state, { id: 3 })).toEqual(null);
        expect(getDataprofileParamById.projector(state, { id: 1 })).toEqual({ id: 1 });
    });

    it('getDataprofilesState', () => {
        const state = createDataprofilesState();
        expect(getDataprofilesState.projector(state)).toEqual(state.state);
    });

    it('getDataprofilesError', () => {
        const state = createDataprofilesState();
        expect(getDataprofilesError.projector(state)).toEqual(state.error);
    });

});
