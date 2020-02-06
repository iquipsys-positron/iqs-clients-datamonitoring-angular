import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import { combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';

const moment = _moment;

@Injectable()
export class IqsDatamonitoringDetailsContainerService {

    private _live$: BehaviorSubject<boolean>;
    private _startDate$: BehaviorSubject<_moment.Moment>;
    private _queryParams$: Observable<Object>;

    constructor(
        private route: ActivatedRoute
    ) {
        this._live$ = new BehaviorSubject(this.route.snapshot.queryParams['live'] === 'true' || true);
        const startDate = moment(this.route.snapshot.queryParams['start_date']);
        this._startDate$ = new BehaviorSubject(startDate.isValid() && !this.live ? startDate : moment());
        this._queryParams$ = combineLatest(
            this.live$,
            this.startDate$
        ).pipe(
            map(([live, sd]) => ({
                'live': live,
                'start_date': live || !sd ? null : sd.toISOString()
            }))
        );
    }

    public get live$(): Observable<boolean> {
        return this._live$.asObservable();
    }

    public get live(): boolean {
        return this._live$.getValue();
    }

    public set live(val: boolean) {
        this._live$.next(val);
    }

    public get startDate$(): Observable<_moment.Moment> {
        return this._startDate$.asObservable();
    }

    public get startDate(): _moment.Moment {
        return this._startDate$.getValue().clone();
    }

    public set startDate(val: _moment.Moment) {
        this.live = false;
        this._startDate$.next(val);
    }

    public get queryParams$(): Observable<Object> {
        return this._queryParams$;
    }

    public get queryParams(): Object {
        let ret;
        this.queryParams$.pipe(take(1)).subscribe(p => ret = p);
        return ret;
    }

    public getStartDateDate(): _moment.Moment {
        let ret;
        this.startDate$.pipe(take(1)).subscribe((d => {
            ret = d ? d.clone().hours(0).minutes(0).seconds(0).milliseconds(0) : null;
        }));
        return ret;
    }

    public setStartDateDate(val: _moment.Moment) {
        const csd = this.startDate;
        val.hours(csd.hours()).minutes(csd.minutes()).seconds(csd.seconds()).milliseconds(csd.milliseconds());
        this.live = false;
        this.startDate = val;
    }

    public getStartDateTime(): string {
        let ret;
        this.startDate$.pipe(take(1)).subscribe(d => {
            ret = d ? d.format('HH:mm') : '00:00';
        });
        return ret;
    }

    public setStartDateTime(val: string) {
        const csd = this.startDate.clone();
        if (!/^\d{2}:\d{2}$/.test(val)) { return; }
        const values = val.split(':').map(s => parseInt(s, 10));
        if (values[0] < 0 || values[0] > 23 || values[1] < 0 || values[1] > 59) { return; }
        csd.hours(values[0]).minutes(values[1]).seconds(0).milliseconds(0);
        this.live = false;
        this.startDate = csd;
    }

    public setLive() {
        this.startDate = moment();
        this.live = true;
    }
}
