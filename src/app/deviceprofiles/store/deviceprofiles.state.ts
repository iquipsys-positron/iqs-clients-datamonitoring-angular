import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from 'iqs-libs-clientshell2-angular';

import { BaseDeviceProfile, DeviceProfile } from '../models';

export interface DeviceprofilesState {
    base: BaseDeviceProfile[];
    profiles: DeviceProfile[];
    state: EntityState;
    error: any;
}

export const getDeviceprofilesStoreState = createFeatureSelector<DeviceprofilesState>('deviceprofiles');

export const getDeviceprofilesBase = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.base);
export const getDeviceprofilesData = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.profiles);
export const getDeviceprofilesState = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.state);
export const getDeviceprofilesError = createSelector(getDeviceprofilesStoreState, (state: DeviceprofilesState) => state.error);
