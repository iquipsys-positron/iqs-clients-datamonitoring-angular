import { Action } from '@ngrx/store';

import { DataProfile } from '../models/index';

export enum DataprofilesActionType {
    DataprofilesInit = '[Dataprofiles] Init',
    DataprofilesSuccess = '[Dataprofiles] Success',
    DataprofilesFailure = '[Dataprofiles] Failure',
    DataprofilesUpdate = '[Dataprofiles] Update',
    DataprofilesUpdateSuccess = '[Dataprofiles] UpdateSuccess',
    DataprofilesUpdateFailure = '[Dataprofiles] UpdateFailure',
}

export class DataprofilesInitAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesInit;

    constructor() { }
}

export class DataprofilesSuccessAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesSuccess;

    constructor(public payload: {
        dataprofiles: DataProfile
    }) { }
}

export class DataprofilesFailureAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export class DataprofilesUpdateAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesUpdate;

    constructor(public payload: {
        dataprofiles: DataProfile
    }) { }
}

export class DataprofilesUpdateSuccessAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesUpdateSuccess;

    constructor(public payload: {
        dataprofiles: DataProfile
    }) { }
}

export class DataprofilesUpdateFailureAction implements Action {
    readonly type = DataprofilesActionType.DataprofilesUpdateFailure;

    constructor(public payload: {
        error: any
    }) { }
}


export type DataprofilesAction =
    DataprofilesInitAction
    | DataprofilesSuccessAction
    | DataprofilesFailureAction
    | DataprofilesUpdateAction
    | DataprofilesUpdateSuccessAction
    | DataprofilesUpdateFailureAction;
