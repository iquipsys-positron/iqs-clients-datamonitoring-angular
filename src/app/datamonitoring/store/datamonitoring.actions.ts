import { Action } from '@ngrx/store';
import * as _moment from 'moment';

import { ObjectData } from '../models';

export enum DatamonitoringActionType {
    DatamonitoringInit = '[Datamonitoring] Init',
    DatamonitoringAbort = '[Datamonitoring] Abort',
    DatamonitoringSuccess = '[Datamonitoring] Success',
    DatamonitoringFailure = '[Datamonitoring] Failure',
    DatamonitoringSetLive = '[Datamonitoring] SetLive',
    DatamonitoringSetDate = '[Datamonitoring] SetDate',
    DatamonitoringSetObjectId = '[Datamonitoring] SetObjectId',
}

export class DatamonitoringInitAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringInit;

    constructor(public payload: {
        object_id: string,
        from_time: _moment.Moment,
        to_time: _moment.Moment
    }) { }
}

export class DatamonitoringAbortAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringAbort;

    constructor() { }
}

export class DatamonitoringSuccessAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringSuccess;

    constructor(public payload: {
        object_data: ObjectData[]
    }) { }
}

export class DatamonitoringFailureAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class DatamonitoringSetLiveAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringSetLive;

    constructor(public payload: {
        live: boolean
    }) { }
}

export class DatamonitoringSetDateAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringSetDate;

    constructor(public payload: {
        date: _moment.Moment
    }) { }
}

export class DatamonitoringSetObjectIdAction implements Action {
    readonly type = DatamonitoringActionType.DatamonitoringSetObjectId;

    constructor(public payload: {
        object_id: string
    }) { }
}

export type DatamonitoringAction =
    DatamonitoringInitAction
    | DatamonitoringAbortAction
    | DatamonitoringSuccessAction
    | DatamonitoringFailureAction
    | DatamonitoringSetLiveAction
    | DatamonitoringSetDateAction
    | DatamonitoringSetObjectIdAction;
