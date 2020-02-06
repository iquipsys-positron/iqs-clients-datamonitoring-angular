import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from 'iqs-libs-clientshell2-angular';
import * as _moment from 'moment';

import { ChartParam, EventValue } from '../models/index';

export interface DatamonitoringState {
    // object id for monitoring
    object_id: string;
    // params values for charts
    params: ChartParam[];
    // event values for table
    events: EventValue[];
    // current state. Should change when data reloaded
    state: EntityState;
    // flag which determines should we read new data in live
    live: boolean;
    // flag which shows us is additional data is loading. Should change only when loading more data
    loading: boolean;
    // the date we working with. Should change with live
    date: _moment.Moment;
    // date when latest data was read
    latestReadDate: _moment.Moment;
    // any error
    error: any;
}

export const getDatamonitoringStoreState = createFeatureSelector<DatamonitoringState>('datamonitoring');

export const getDatamonitoringObjectId = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.object_id);
export const getDatamonitoringParams = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.params);
export const getDatamonitoringEvents = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.events);
export const getDatamonitoringState = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.state);
export const getDatamonitoringLive = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.live);
export const getDatamonitoringLoading = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.loading);
export const getDatamonitoringDate = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.date);
export const getDatamonitoringLatestReadDate =
    createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.latestReadDate);
export const getDatamonitoringError = createSelector(getDatamonitoringStoreState, (state: DatamonitoringState) => state.error);
