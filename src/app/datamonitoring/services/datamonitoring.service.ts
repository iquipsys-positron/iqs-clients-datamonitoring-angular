import { Injectable } from '@angular/core';
import { IqsOrganizationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { Store } from '@ngrx/store';
import * as _moment from 'moment';
import { Observable, combineLatest, interval, BehaviorSubject, of } from 'rxjs';
import { filter, distinctUntilKeyChanged, withLatestFrom, startWith, take, scan, tap, switchMap } from 'rxjs/operators';

import { ChartParam, EventValue } from '../models/index';
import {
    DatamonitoringState,
    DatamonitoringInitAction,
    DatamonitoringSetDateAction,
    getDatamonitoringObjectId,
    getDatamonitoringParams,
    getDatamonitoringEvents,
    getDatamonitoringState,
    getDatamonitoringLive,
    getDatamonitoringLoading,
    getDatamonitoringDate,
    getDatamonitoringLatestReadDate,
    getDatamonitoringError,
    DatamonitoringSetLiveAction,
    DatamonitoringSetObjectIdAction,
} from '../store/index';

const moment = _moment;

@Injectable()
export class IqsDatamonitoringService {

    static dpUpdateSub = null;

    private _liveActive$: BehaviorSubject<boolean>;

    constructor(
        private store: Store<DatamonitoringState>,
        private organizationsService: IqsOrganizationsService
    ) {
        this._liveActive$ = new BehaviorSubject(false);
    }

    public init(): void {
        if (IqsDatamonitoringService.dpUpdateSub) { return; }
        this.organizationsService.init();
        IqsDatamonitoringService.dpUpdateSub = combineLatest(
            this.organizationsService.current$.pipe(
                filter(organization => organization !== null),
                distinctUntilKeyChanged('id')
            ),
            this.objectId$.pipe(filter(oid => !!oid)),
            this.date$.pipe(filter(d => !!d)),
        )
            .pipe(withLatestFrom(this.live$, this.lastReadDate$))
            .subscribe(([[organization, object_id, date], live, latestReadDate]) => {
                this._dispatchInit(object_id, date, live, latestReadDate);
            });
        this._liveActive$.pipe(
            switchMap((la) =>
                la ? interval(10000).pipe(
                    startWith(0),
                    withLatestFrom(this.live$),
                    filter(([i, live]) => live),
                    scan(([acc, live], tick) => [acc + 1, live]),
                    withLatestFrom(this.state$)
                ) : of()
            )
        ).subscribe(([[i, live], state]) => {
            if (state === EntityState.Progress) { return; }
            this.store.dispatch(new DatamonitoringSetDateAction({ date: moment() }));
        });
    }

    private _dispatchInit(object_id: string, date: _moment.Moment, live: boolean, latestReadDate: _moment.Moment) {
        if (date.valueOf() > moment().valueOf()) {
            return this.setLive(true);
        }
        let from_time: _moment.Moment;
        if (live && !latestReadDate) {
            from_time = moment().startOf('day');
        } else if (!live) {
            from_time = latestReadDate && latestReadDate.clone().startOf('d').isSame(date.clone().startOf('d'))
                ? latestReadDate.clone()
                : moment(date).startOf('day');
        } else {
            from_time = latestReadDate.clone();
        }
        const to_time = live ? moment() : moment(date).endOf('day');
        if (latestReadDate && date.isBefore(latestReadDate) && date.isAfter(latestReadDate.clone().startOf('d'))) { return; }
        this.store.dispatch(new DatamonitoringInitAction({
            object_id,
            from_time,
            to_time
        }));
    }

    public read() {
        combineLatest(
            this.objectId$,
            this.date$,
            this.live$,
            this.lastReadDate$
        ).pipe(take(1)).subscribe(([object_id, date, live, latestReadDate]) => {
            this._dispatchInit(object_id, date, live, latestReadDate);
        });
    }

    public get objectId$(): Observable<string> {
        return this.store.select(getDatamonitoringObjectId);
    }

    public get params$(): Observable<ChartParam[]> {
        return this.store.select(getDatamonitoringParams);
    }

    public get events$(): Observable<EventValue[]> {
        return this.store.select(getDatamonitoringEvents);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getDatamonitoringState);
    }

    public get live$(): Observable<boolean> {
        return this.store.select(getDatamonitoringLive);
    }

    public get loading$(): Observable<boolean> {
        return this.store.select(getDatamonitoringLoading);
    }

    public get date$(): Observable<_moment.Moment> {
        return this.store.select(getDatamonitoringDate);
    }

    public get date(): _moment.Moment {
        let ret;
        this.date$.pipe(take(1)).subscribe(d => ret = d ? d.clone() : null);
        return ret;
    }

    public get lastReadDate$(): Observable<_moment.Moment> {
        return this.store.select(getDatamonitoringLatestReadDate);
    }

    public get error$(): Observable<any> {
        return this.store.select(getDatamonitoringError);
    }

    public get liveActive$(): Observable<boolean> {
        return this._liveActive$.asObservable();
    }

    public get liveActive(): boolean {
        return this._liveActive$.getValue();
    }

    public setLive(val: boolean) {
        this.store.dispatch(new DatamonitoringSetLiveAction({ live: val }));
        if (val) {
            this.store.dispatch(new DatamonitoringSetDateAction({ date: moment() }));
        }
    }

    public setDate(date: _moment.Moment) {
        this.setLive(false);
        this.store.dispatch(new DatamonitoringSetDateAction({ date }));
    }

    public setObjectId(object_id: string) {
        this.store.dispatch(new DatamonitoringSetObjectIdAction({ object_id }));
    }

    public setLiveActive(val: boolean) {
        this._liveActive$.next(val);
    }
}
