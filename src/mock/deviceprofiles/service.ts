import { Injectable } from '@angular/core';
import { EntityState } from 'iqs-libs-clientshell2-angular';
import { Observable, BehaviorSubject } from 'rxjs';

import * as utils from '../utility';
import { DeviceProfile, BaseDeviceProfile } from '../../app/deviceprofiles/models';

@Injectable()
export class IqsDeviceprofilesServiceMock {

    private _baseDeviceprofiles$: BehaviorSubject<BaseDeviceProfile[]>;
    private _deviceprofiles$: BehaviorSubject<DeviceProfile[]>;
    private _state$: BehaviorSubject<EntityState>;
    private _error$: BehaviorSubject<any>;
    private organization_id: string;

    constructor() {
        this._baseDeviceprofiles$ = new BehaviorSubject([]);
        this._deviceprofiles$ = new BehaviorSubject([]);
        this._state$ = new BehaviorSubject(EntityState.Data);
        this._error$ = new BehaviorSubject(null);
    }

    public init(payload?: {
        organization_id: string
    }): void {
        this.organization_id = payload && payload.organization_id || '00000000000000000000000000000000';
        this._baseDeviceprofiles$.next(utils.deviceprofiles.getBaseDeviceProfiles());
        this._deviceprofiles$.next(utils.deviceprofiles.findByOrganizationId(this.organization_id));
        this.state = EntityState.Data;
    }

    public get baseDeviceprofiles$(): Observable<BaseDeviceProfile[]> {
        return this._baseDeviceprofiles$.asObservable();
    }

    public get baseDeviceprofiles(): BaseDeviceProfile[] {
        return this._baseDeviceprofiles$.getValue();
    }

    public set baseDeviceprofiles(val: BaseDeviceProfile[]) {
        this._baseDeviceprofiles$.next(val);
    }

    public get deviceprofiles$(): Observable<DeviceProfile[]> {
        return this._deviceprofiles$.asObservable();
    }

    public get deviceprofiles(): DeviceProfile[] {
        return this._deviceprofiles$.getValue();
    }

    public set deviceprofiles(val: DeviceProfile[]) {
        this._deviceprofiles$.next(val);
    }

    public get state$(): Observable<EntityState> {
        return this._state$.asObservable();
    }

    public get state(): EntityState {
        return this._state$.getValue();
    }

    public set state(val: EntityState) {
        this._state$.next(val);
    }

    public get error$(): Observable<any> {
        return this._error$.asObservable();
    }

    public get error(): any {
        return this._error$.getValue();
    }

    public set error(val: any) {
        this._error$.next(val);
    }
}
