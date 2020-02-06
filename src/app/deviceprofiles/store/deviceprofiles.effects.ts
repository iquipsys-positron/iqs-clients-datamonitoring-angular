import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsDeviceprofilesDataService } from '../services/deviceprofiles.data.service';
import * as actionsFromDeviceprofiles from './deviceprofiles.actions';
import { BaseDeviceProfile, DeviceProfile } from '../models';

@Injectable()
export class IqsDeviceprofilesEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsDeviceprofilesDataService
    ) { }

    @Effect() deviceprofiles$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDeviceprofiles.DeviceprofilesActionType.DeviceprofilesInit),
        switchMap((action: actionsFromDeviceprofiles.DeviceprofilesInitAction) => {
            return forkJoin(
                this.ds.readBaseDeviceProfiles(),
                this.ds.readDeviceProfiles()
            ).pipe(
                map(([base, profiles]: [BaseDeviceProfile[], DeviceProfile[]]) =>
                    new actionsFromDeviceprofiles.DeviceprofilesSuccessAction({ base, profiles })),
                catchError(error => of(new actionsFromDeviceprofiles.DeviceprofilesFailureAction({ error })))
            );
        })
    );
}
