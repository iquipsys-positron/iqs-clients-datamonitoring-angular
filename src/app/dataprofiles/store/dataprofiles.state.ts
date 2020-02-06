import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from 'iqs-libs-clientshell2-angular';

import { DataProfile } from '../models/index';

export interface DataprofilesState {
    dataprofiles: DataProfile;
    state: EntityState;
    error: any;
}

export const getDataprofilesStoreState = createFeatureSelector<DataprofilesState>('dataprofiles');

export const getDataprofilesData = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.dataprofiles);
export const getDataprofileParamById = createSelector(getDataprofilesStoreState, (state: DataprofilesState, props: { id: number }) => {
    if (!props || !props.id || !state || !state.dataprofiles
        || !state.dataprofiles.param_types || !state.dataprofiles.param_types.length) { return null; }
    return state.dataprofiles.param_types.find(pid => pid.id === props.id) || null;

});
export const getDataprofilesState = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.state);
export const getDataprofilesError = createSelector(getDataprofilesStoreState, (state: DataprofilesState) => state.error);
