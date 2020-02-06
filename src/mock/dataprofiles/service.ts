import { Injectable } from '@angular/core';
import { EntityState } from 'iqs-libs-clientshell2-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import * as utils from '../utility';
import {
    DataProfile,
    ActuatorCommandType,
    SensorEventType,
    SensorParameterType,
    SensorStateType,
    DataProfileType
} from '../../app/dataprofiles/models';

@Injectable()
export class IqsDataprofilesServiceMock {

    private _dataprofiles$: BehaviorSubject<DataProfile>;
    private _state$: BehaviorSubject<EntityState>;
    private _error$: BehaviorSubject<any>;
    private organization_id: string;

    constructor() {
        this._dataprofiles$ = new BehaviorSubject(null);
        this._state$ = new BehaviorSubject(EntityState.Empty);
        this._error$ = new BehaviorSubject(null);
    }

    public init(payload?: {
        organization_id: string
    }): void {
        this.organization_id = payload && payload.organization_id || '00000000000000000000000000000000';
        this._dataprofiles$.next(utils.dataprofiles.findByOrganizationId(this.organization_id));
        this.state = EntityState.Data;
    }

    public get dataprofiles$(): Observable<DataProfile> {
        return this._dataprofiles$.asObservable();
    }

    public get dataprofiles(): DataProfile {
        return this._dataprofiles$.getValue();
    }

    public set dataprofiles(val: DataProfile) {
        this._dataprofiles$.next(val);
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

    public update(data: DataProfile): void {
        utils.dataprofiles.updateByOrganizationId(this.organization_id, data);
    }

    public getTypeById(type: DataProfileType, id: number): ActuatorCommandType | SensorEventType | SensorParameterType | SensorStateType {
        return this.dataprofiles[type] ? (<any[]>this.dataprofiles[type]).find(it => it.id === id) || null : null;
    }
}
