import { EntityState } from 'iqs-libs-clientshell2-angular';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import cloneDeep from 'lodash/cloneDeep';

import * as fromDataprofilesActions from './dataprofiles.actions';
import { dataprofilesInitialState, dataprofilesReducer } from './dataprofiles.reducer';
import { DataProfile } from '../models/index';
import { utils } from '../../../mock';

describe('[Dataprofiles] store/reducer', () => {

    let dataprofiles: DataProfile;

    beforeEach(() => {
        resetToCurrentDefault();
        dataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId('00000000000000000000000000000000'));
    });

    it('should have initial state', () => {
        expect(dataprofilesReducer(undefined, { type: null })).toEqual(dataprofilesInitialState);
        expect(dataprofilesReducer(dataprofilesInitialState, { type: null })).toEqual(dataprofilesInitialState);
    });

    it('should reduce dataprofiles states', () => {
        const joc = jasmine.objectContaining;
        expect(dataprofilesReducer({ ...dataprofilesInitialState, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesInitAction()))
            .toEqual(joc({ error: null, state: EntityState.Progress }));
        expect(dataprofilesReducer({ ...dataprofilesInitialState, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesSuccessAction({ dataprofiles })))
            .toEqual({ dataprofiles, error: null, state: EntityState.Data });
        expect(dataprofilesReducer({ ...dataprofilesInitialState, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesSuccessAction({ dataprofiles: null })))
            .toEqual({ dataprofiles: null, error: null, state: EntityState.Empty });
        expect(dataprofilesReducer(dataprofilesInitialState,
            new fromDataprofilesActions.DataprofilesFailureAction({ error: 'error' })))
            .toEqual(joc({ error: 'error', state: EntityState.Error }));
    });

    it('should reduce dataprofiles update states', () => {
        const joc = jasmine.objectContaining;
        const newProfiles: DataProfile = cloneDeep(dataprofiles);
        newProfiles.param_types = [];
        expect(dataprofilesReducer({ dataprofiles, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesUpdateAction({ dataprofiles: newProfiles })))
            .toEqual(joc({ error: null, state: EntityState.Progress }));
        expect(dataprofilesReducer({ dataprofiles, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesUpdateSuccessAction({ dataprofiles: newProfiles })))
            .toEqual({ dataprofiles: newProfiles, error: null, state: EntityState.Data });
        expect(dataprofilesReducer({ dataprofiles, error: 'error', state: EntityState.Error },
            new fromDataprofilesActions.DataprofilesUpdateSuccessAction({ dataprofiles: null })))
            .toEqual({ dataprofiles: null, error: null, state: EntityState.Empty });
        expect(dataprofilesReducer({ ...dataprofilesInitialState, dataprofiles },
            new fromDataprofilesActions.DataprofilesUpdateFailureAction({ error: 'error' })))
            .toEqual({ dataprofiles, error: 'error', state: EntityState.Error });
    });

});
