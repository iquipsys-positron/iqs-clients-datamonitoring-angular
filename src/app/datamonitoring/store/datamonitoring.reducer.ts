import { EntityState } from 'iqs-libs-clientshell2-angular';
import { fromJS } from 'immutable';
import cloneDeep from 'lodash/cloneDeep';
import * as _moment from 'moment';

import { DatamonitoringAction, DatamonitoringActionType } from './datamonitoring.actions';
import { DatamonitoringState } from './datamonitoring.state';
import { EventValue, ChartParam, ObjectData } from '../models';

const moment = _moment;

export const datamonitoringInitialState: DatamonitoringState = {
    object_id: null,
    params: [],
    events: [],
    state: EntityState.Empty,
    live: false,
    loading: false,
    date: null,
    latestReadDate: null,
    error: null
};

function isEmpty(params: ChartParam[], events: EventValue[]) {
    let emptyFlag = events.length === 0;
    if (emptyFlag) {
        for (const param of params) {
            if (param.values.length > 0) {
                emptyFlag = false;
                break;
            }
        }
    }
    return emptyFlag;
}

function objectDataToStateData(params: ChartParam[], events: EventValue[], object_data: ObjectData[]) {
    const paramsIdMap = params ? params.reduce((acc, val, idx) => ({ ...acc, [val.id]: idx }), {}) : {};
    for (const od of object_data) {
        for (const val of od.values) {
            const valDate = moment(val.time).valueOf();
            const valTime = moment(val.time).format('HH:mm:ss');
            if (Array.isArray(val.events) && val.events.length > 0) {
                for (const event of val.events) {
                    if (!event['typ']) { continue; }
                    events.push({
                        id: event['id'],
                        dateVal: valDate,
                        typ: event['typ'],
                        value: event['val']
                    });
                }
            }
            if (Array.isArray(val.params) && val.params.length > 0) {
                for (const param of val.params) {
                    if (!param['typ']) { continue; }
                    if (!paramsIdMap.hasOwnProperty(param['id'])) {
                        params.push({
                            id: param['id'],
                            typ: param['typ'],
                            name: '',
                            values: []
                        });
                        paramsIdMap[param['id']] = params.length - 1;
                    }
                    params[paramsIdMap[param['id']]].values.push({
                        name: valTime,
                        value: [valDate, param['val']]
                    });
                }
            }
        }
    }
}

function sortStateData(params: ChartParam[], events: EventValue[]) {
    for (const param of params) {
        param.values.sort((a, b) => a.value[0] - b.value[0]);
        param.values = param.values.reduce((acc, val) =>
            (!acc.length || acc[acc.length - 1].value[1] !== val.value[1] ? [...acc, val] : acc), []);
    }
    events.sort((a, b) => a.dateVal - b.dateVal);
}

export function datamonitoringReducer(
    state = datamonitoringInitialState,
    action: DatamonitoringAction
): DatamonitoringState {

    switch (action.type) {

        case DatamonitoringActionType.DatamonitoringInit: {
            let map = fromJS(state)
                .set('error', null);
            if (!state.latestReadDate || action.payload.to_time.day() !== state.latestReadDate.day() || state.error) {
                map = map.set('state', EntityState.Progress);
                if (!state.latestReadDate) {
                    map = map.set('latestReadDate', action.payload.to_time.clone().startOf('d'));
                }
            } else {
                map = map.set('loading', true);
            }
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringAbort: {
            const map = fromJS(state)
                .set('state', isEmpty(state.params, state.events) ? EntityState.Empty : EntityState.Data)
                .set('loading', false);
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringSuccess: {
            const latestReadDate = action.payload.object_data && action.payload.object_data.length
                && action.payload.object_data[0].values && action.payload.object_data[0].values.length
                && action.payload.object_data[0].values.slice(-1)[0].time
                ? moment(action.payload.object_data[0].values.slice(-1)[0].time)
                : state.latestReadDate;
            const params: ChartParam[] = cloneDeep(state.params);
            const events: EventValue[] = cloneDeep(state.events);
            objectDataToStateData(params, events, action.payload.object_data);
            sortStateData(params, events);
            const map = fromJS(state)
                .set('params', params)
                .set('events', events)
                .set('state', isEmpty(params, []) ? EntityState.Empty : EntityState.Data)
                .set('loading', false)
                .set('latestReadDate', latestReadDate)
                .set('error', null);
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringFailure: {
            let map = fromJS(state)
                .set('loading', false)
                .set('error', action.payload.error);
            if (state.state === EntityState.Progress) {
                map = map.set('state', EntityState.Error);
            }
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringSetLive: {
            const map = fromJS(state)
                .set('live', action.payload.live);
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringSetDate: {
            const map = fromJS(state)
                .set('date', action.payload.date);
            return <DatamonitoringState>map.toJS();
        }

        case DatamonitoringActionType.DatamonitoringSetObjectId: {
            const map = fromJS(state)
                .set('object_id', action.payload.object_id)
                .set('latestReadDate', null)
                .set('params', [])
                .set('events', [])
                .set('error', null);
            return <DatamonitoringState>map.toJS();
        }

        default: {
            return state;
        }
    }
}
