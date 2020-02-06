import { Action } from '@ngrx/store';

import { BaseDeviceProfile, DeviceProfile } from '../models';

export enum DeviceprofilesActionType {
    DeviceprofilesInit = '[Deviceprofiles] Init',
    DeviceprofilesSuccess = '[Deviceprofiles] Success',
    DeviceprofilesFailure = '[Deviceprofiles] Failure'
}

export class DeviceprofilesInitAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesInit;

    constructor() { }
}

export class DeviceprofilesSuccessAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesSuccess;

    constructor(public payload: {
        base: BaseDeviceProfile[],
        profiles: DeviceProfile[]
    }) { }
}

export class DeviceprofilesFailureAction implements Action {
    readonly type = DeviceprofilesActionType.DeviceprofilesFailure;

    constructor(public payload: {
        error: any
    }) { }
}

export type DeviceprofilesAction =
    DeviceprofilesInitAction
    | DeviceprofilesFailureAction
    | DeviceprofilesSuccessAction;
