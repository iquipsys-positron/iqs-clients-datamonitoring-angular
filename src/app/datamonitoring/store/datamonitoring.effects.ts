import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { IqsObjectDataDataService } from '../services/object-data.data.service';
import * as actionsFromDatamonitoring from './datamonitoring.actions';

@Injectable()
export class IqsDatamonitoringEffects {
    constructor(
        private actions$: Actions,
        private objectDataDs: IqsObjectDataDataService,
    ) { }

    @Effect() datamonitoring$: Observable<Action> = this.actions$.pipe(
        ofType(
            actionsFromDatamonitoring.DatamonitoringActionType.DatamonitoringInit,
            actionsFromDatamonitoring.DatamonitoringActionType.DatamonitoringAbort
        ),
        switchMap((action: actionsFromDatamonitoring.DatamonitoringInitAction | actionsFromDatamonitoring.DatamonitoringAbortAction) => {
            if (action.type === actionsFromDatamonitoring.DatamonitoringActionType.DatamonitoringInit) {
                const params: any = { ...action.payload };
                if (action.payload.from_time) { params.from_time = action.payload.from_time.toISOString(); }
                if (action.payload.to_time) { params.to_time = action.payload.to_time.toISOString(); }
                return this.objectDataDs.readData(params)
                    .pipe(
                        map(object_data => new actionsFromDatamonitoring.DatamonitoringSuccessAction({ object_data })),
                        catchError(error => of(new actionsFromDatamonitoring.DatamonitoringFailureAction({ error })))
                    );
            } else {
                return of();
            }
        })
    );
}
