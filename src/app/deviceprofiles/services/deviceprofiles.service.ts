import { Injectable } from '@angular/core';
import { IqsOrganizationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, distinctUntilKeyChanged, take, distinctUntilChanged } from 'rxjs/operators';

import { BaseDeviceProfile, DeviceProfile } from '../models';
import {
    DeviceprofilesInitAction,
    DeviceprofilesState,
    getDeviceprofilesBase,
    getDeviceprofilesError,
    getDeviceprofilesState,
    getDeviceprofilesData
} from '../store';
import { IqsDataprofilesService } from '../../dataprofiles';

@Injectable()
export class IqsDeviceprofilesService {

    static dpUpdateSub = null;

    constructor(
        private dataprofilesService: IqsDataprofilesService,
        private store: Store<DeviceprofilesState>,
        private organizationsService: IqsOrganizationsService
    ) { }

    public init(): void {
        if (IqsDeviceprofilesService.dpUpdateSub) { return; }
        this.organizationsService.init();
        this.dataprofilesService.init();
        IqsDeviceprofilesService.dpUpdateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id')
            ),
            this.dataprofilesService.dataprofiles$.pipe(
                filter(dp => dp !== null)
            )
        ).subscribe(() => {
            this.store.dispatch(new DeviceprofilesInitAction());
        });
    }

    public get deviceprofiles$(): Observable<DeviceProfile[]> {
        return this.store.select(getDeviceprofilesData).pipe(
            // rxjs can't compare deep, so this is some kind of verification our object is changed
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        );
    }

    public get baseDeviceprofiles$(): Observable<BaseDeviceProfile[]> {
        return this.store.select(getDeviceprofilesBase).pipe(
            // rxjs can't compare deep, so this is some kind of verification our object is changed
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        );
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getDeviceprofilesState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getDeviceprofilesError);
    }

    public getBaseProfileById(id: string): BaseDeviceProfile {
        let res: BaseDeviceProfile = null;
        this.baseDeviceprofiles$.pipe(take(1)).subscribe(profiles => {
            res = profiles && profiles.length ? profiles.find(p => p.id === id) || null : null;
        });
        return res;
    }
}
