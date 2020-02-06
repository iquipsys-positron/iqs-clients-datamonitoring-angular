import { Injectable } from '@angular/core';
import { IqsOrganizationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, distinctUntilKeyChanged, take } from 'rxjs/operators';

import {
    DataProfile,
    DataProfileType,
    ActuatorCommandType,
    SensorEventType,
    SensorParameterType,
    SensorStateType
} from '../models/index';
import {
    DataprofilesInitAction,
    DataprofilesUpdateAction,
    DataprofilesState,
    getDataprofilesData,
    getDataprofileParamById,
    getDataprofilesError,
    getDataprofilesState
} from '../store/index';

@Injectable()
export class IqsDataprofilesService {

    static dpUpdateSub = null;

    constructor(
        private store: Store<DataprofilesState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init(): void {
        if (IqsDataprofilesService.dpUpdateSub) { return; }
        this.organizationsService.init();
        IqsDataprofilesService.dpUpdateSub = this.organizationsService.current$.pipe(
            filter(organization => organization !== null),
            distinctUntilKeyChanged('id')
        ).subscribe(() => {
            this.store.dispatch(new DataprofilesInitAction());
        });
    }

    public get dataprofiles$(): Observable<DataProfile> {
        return this.store.select(getDataprofilesData);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getDataprofilesState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getDataprofilesError);
    }

    public findParamById(param_type: number): SensorParameterType {
        let res: SensorParameterType = null;
        this.store.select(getDataprofileParamById, { id: param_type }).pipe(take(1)).subscribe(param => res = param);
        return res;
    }

    public getTypeById(type: DataProfileType, id: number): ActuatorCommandType | SensorEventType | SensorParameterType | SensorStateType {
        let res: ActuatorCommandType | SensorEventType | SensorParameterType | SensorStateType = null;
        this.dataprofiles$.pipe(take(1)).subscribe(profiles => {
            res = profiles[type] ? (<any[]>profiles[type]).find(it => it.id === id) || null : null;
        });
        return res;
    }

    public update(data: DataProfile): void {
        this.store.dispatch(new DataprofilesUpdateAction({ dataprofiles: data }));
    }
}
