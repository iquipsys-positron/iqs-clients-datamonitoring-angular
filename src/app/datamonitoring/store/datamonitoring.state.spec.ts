import { EntityState } from 'iqs-libs-clientshell2-angular';
import random from 'lodash/random';
import * as _moment from 'moment';

import {
    DatamonitoringState,
    getDatamonitoringObjectId,
    getDatamonitoringParams,
    getDatamonitoringEvents,
    getDatamonitoringState,
    getDatamonitoringLive,
    getDatamonitoringLoading,
    getDatamonitoringDate,
    getDatamonitoringLatestReadDate,
    getDatamonitoringError,
} from './datamonitoring.state';
import { ChartParam, ChartParamValue, EventValue } from '../models';

const moment = _moment;

const createDatamonitoringParamsValues = (size?: number): ChartParamValue[] => {
    size = size || random(1, 20);
    const ret: ChartParamValue[] = [];
    for (let i = 0; i < size; i++) {
        const m = moment().add(i, 'm');
        ret.push({
            name: m.format('HH:mm'),
            value: [m.valueOf(), random(10)]
        });
    }
    return ret;
};

const createDatamonitoringParams = (params?: ChartParam[]): ChartParam[] => {
    if (params) { return params; }
    const ret: ChartParam[] = [];
    const size = random(1, 4);
    for (let i = 0; i < size; i++) {
        ret.push({
            id: random(1, 4),
            typ: random(1, 4),
            values: createDatamonitoringParamsValues()
        });
    }
    return ret;
};

const createDatamonitoringEvents = (events?: EventValue[]): EventValue[] => {
    if (events) { return events; }
    const ret: EventValue[] = [];
    const size = random(1, 4);
    for (let i = 0; i < size; i++) {
        const m = moment().add(i, 'm');
        ret.push({
            id: random(1, 4),
            typ: random(1, 4),
            dateVal: m.valueOf(),
            value: random(10)
        });
    }
    return ret;
};

const createDatamonitoringState = ({
    object_id = '00000000000000000000000000000000',
    params = createDatamonitoringParams(),
    events = createDatamonitoringEvents(),
    state = EntityState.Empty,
    live = false,
    loading = false,
    date = moment(),
    latestReadDate = null,
    error = null
} = {}): DatamonitoringState => ({
    object_id,
    params,
    events,
    state,
    live,
    loading,
    date,
    latestReadDate,
    error,
});

describe('[Datamonitoring] store/state', () => {

    it('getDatamonitoringObjectId', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringObjectId.projector(state)).toEqual(state.object_id);
    });

    it('getDatamonitoringParams', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringParams.projector(state)).toEqual(state.params);
    });

    it('getDatamonitoringEvents', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringEvents.projector(state)).toEqual(state.events);
    });

    it('getDatamonitoringState', () => {
        const state = createDatamonitoringState({ state: EntityState.Progress });
        expect(getDatamonitoringState.projector(state)).toEqual(state.state);
    });

    it('getDatamonitoringLive', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringLive.projector(state)).toEqual(state.live);
    });

    it('getDatamonitoringLoading', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringLoading.projector(state)).toEqual(state.loading);
    });

    it('getDatamonitoringDate', () => {
        const state = createDatamonitoringState();
        expect(getDatamonitoringDate.projector(state)).toEqual(state.date);
    });

    it('getDatamonitoringLatestReadDate', () => {
        const state = createDatamonitoringState({ latestReadDate: moment().subtract(5, 'm') });
        expect(getDatamonitoringLatestReadDate.projector(state)).toEqual(state.latestReadDate);
    });

    it('getDatamonitoringError', () => {
        const state = createDatamonitoringState({ error: 'error' });
        expect(getDatamonitoringError.projector(state)).toEqual(state.error);
    });

});
