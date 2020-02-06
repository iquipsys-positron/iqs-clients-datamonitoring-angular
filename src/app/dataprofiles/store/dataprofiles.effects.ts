import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsDataprofilesDataService } from '../services/dataprofiles.data.service';
import * as actionsFromDataprofiles from './dataprofiles.actions';

@Injectable()
export class IqsDataprofilesEffects {
    constructor(
        private actions$: Actions,
        private ds: IqsDataprofilesDataService,
    ) { }

    @Effect() dataprofiles$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDataprofiles.DataprofilesActionType.DataprofilesInit),
        switchMap((action: actionsFromDataprofiles.DataprofilesInitAction) => {
            return this.ds.readDataprofiles()
                .pipe(
                    map((dataprofiles) => new actionsFromDataprofiles.DataprofilesSuccessAction({ dataprofiles })),
                    catchError(error => of(new actionsFromDataprofiles.DataprofilesFailureAction({ error })))
                );
        })
    );

    @Effect() dataprofilesUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(actionsFromDataprofiles.DataprofilesActionType.DataprofilesUpdate),
        switchMap((action: actionsFromDataprofiles.DataprofilesUpdateAction) => {
            return this.ds.updateDataprofiles(action.payload.dataprofiles)
                .pipe(
                    map((dataprofiles) => new actionsFromDataprofiles.DataprofilesUpdateSuccessAction({ dataprofiles })),
                    catchError(error => of(new actionsFromDataprofiles.DataprofilesUpdateFailureAction({ error })))
                );
        })
    );
}
