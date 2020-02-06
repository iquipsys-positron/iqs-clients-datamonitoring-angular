import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ControlObject,
    EntityState,
    IqsControlObjectsService,
    IqsSessionConfigService
} from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';
import { EmptyStateAction } from 'pip-webui2-controls';
import { PipNavService } from 'pip-webui2-nav';
import { Observable, combineLatest, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith, debounceTime, filter, skipWhile, distinctUntilChanged } from 'rxjs/operators';
import { PipMediaService } from 'pip-webui2-layouts';

import { datamonitoringDetailsContainerTranslations } from './details-container.strings';
import { containersTranslations } from '../containers.strings';
import { ListContainerItem, ChartParam, EventValue } from '../../models';
import { IqsDatamonitoringService } from '../../services';
import { IqsDataprofilesService, IqsDataprofilesTranslateService, ValueType, ValueUnit } from '../../../dataprofiles';

const moment = _moment;

enum MainPanelType {
    Summary = 'summary',
    Splitted = 'splitted',
    Stacked = 'stacked',
    Events = 'events',
    Map = 'map'
}

enum SidePanelType {
    Events = 'events',
    Map = 'map'
}

interface LocalizedItemEntry {
    [param_id: number]: {
        name: string,
        type: ValueType,
        unit?: string
    };
}

@Component({
    selector: 'iqs-details-container',
    templateUrl: './details-container.component.html',
    styleUrls: ['./details-container.component.scss']
})
export class IqsDatamonitoringDetailsContainerComponent implements OnInit, OnDestroy {

    private subs: Subscription;

    public blobsUrl: string;
    public emptyStateActions: EmptyStateAction[];
    public emptyStateReadErrorActions: EmptyStateAction[];
    public form: FormGroup;
    public timeOptions: string[];

    public dataState$: Observable<EntityState>;
    public date$: Observable<_moment.Moment>;
    public events$: Observable<EventValue[]>;
    public item$: Observable<ListContainerItem>;
    public items$: Observable<ListContainerItem[]>;
    public live$: Observable<boolean>;
    public loading$: Observable<boolean>;
    public mainPanelType$: BehaviorSubject<MainPanelType>;
    public object$: Observable<ControlObject>;
    public params$: Observable<ChartParam[]>;
    public sidePanelOpened$: BehaviorSubject<boolean>;
    public sidePanelType$: BehaviorSubject<SidePanelType>;
    public state$: Observable<EntityState>;

    constructor(
        private fb: FormBuilder,
        private media: PipMediaService,
        private nav: PipNavService,
        private route: ActivatedRoute,
        private router: Router,
        private sessionConfig: IqsSessionConfigService,
        private snackBar: MatSnackBar,
        private translate: TranslateService,

        private dataprofilesService: IqsDataprofilesService,
        private dpTranslateService: IqsDataprofilesTranslateService,
        private dmService: IqsDatamonitoringService,
        private objectsService: IqsControlObjectsService,
    ) {
        this.subs = new Subscription();
        this.blobsUrl = this.sessionConfig.serverUrl + '/api/v1/blobs/';

        this.translate.setTranslation('en', datamonitoringDetailsContainerTranslations.en, true);
        this.translate.setTranslation('en', containersTranslations.en, true);
        this.translate.setTranslation('ru', datamonitoringDetailsContainerTranslations.ru, true);
        this.translate.setTranslation('ru', containersTranslations.ru, true);

        this.nav.showTitle('DATAMONITORING_DETAILS_TITLE');
        this.nav.showNavIcon({
            icon: 'arrow_back',
            action: () => {
                this.router.navigate(['']);
            }
        });

        this.emptyStateActions = [
            {
                title: this.translate.instant('DATAMONITORING_DETAILS_ERROR_ACTION_RETRY'),
                action: () => { this.objectsService.read(); }
            }
        ];
        this.emptyStateReadErrorActions = [
            {
                title: this.translate.instant('DATAMONITORING_DETAILS_ERROR_ACTION_RETRY'),
                action: () => { this.dmService.read(); }
            }
        ];
        this.timeOptions = [];
        for (let h = 0; h < 24; h++) {
            this.timeOptions.push(h.toString().padStart(2, '0') + ':00');
            this.timeOptions.push(h.toString().padStart(2, '0') + ':30');
        }
        this.form = this.fb.group({
            date: [null],
            time: ['00:00', Validators.pattern(/^\d{2}:\d{2}$/)]
        });
        this.subs.add(this.dmService.date$
            .pipe(filter(date => !!date))
            .subscribe(date => {
                this.form.setValue({
                    date: date,
                    time: moment(date).format('HH:mm')
                }, { emitEvent: false });
            }));
        this.object$ = this.objectsService.findById$(this.route.snapshot.params['id']);
        this.subs.add(this.object$.pipe(filter(o => !!o)).subscribe(o => {
            this.dmService.setObjectId(o.id);
        }));
        this.item$ = combineLatest(
            this.object$,
            this.translate.onLangChange.pipe(startWith(this.translate.currentLang))
        ).pipe(map(([object, payload]) => this._objectToItem(object)));
        this.items$ = combineLatest(
            this.objectsService.objects$,
            this.translate.onLangChange
        ).pipe(map(([objects, payload]) => objects.map(object => this._objectToItem(object))));
        this.state$ = this.objectsService.state$.pipe(skipWhile(s => s === EntityState.Empty));
        this.dataState$ = this.dmService.state$.pipe(skipWhile(s => s === EntityState.Empty));

        this.subs.add(this.form.valueChanges.subscribe(val => {
            if (!this.form.valid) { return; }
            const d = moment(val.date);
            const time = val.time.split(':').map(v => parseInt(v, 10));
            d.hours(time[0]).minutes(time[1]);
            this.dmService.setDate(d);
        }));
        this.subs.add(this.dmService.error$
            .pipe(filter(error => error !== null))
            .subscribe(error => {
                this.snackBar.open(
                    error.statusText || error.message || error,
                    undefined,
                    { horizontalPosition: 'left', verticalPosition: 'bottom', duration: 2000, panelClass: 'pip-error-snackbar' }
                );
            }));
        this.date$ = this.dmService.date$;
        this.live$ = this.dmService.live$;
        this.loading$ = this.dmService.loading$;
        const dpParamsAndEvents = combineLatest(
            this.translate.onLangChange.pipe(startWith(this.translate.currentLang)),
            this.dataprofilesService.dataprofiles$.pipe(
                filter(dp => !!dp),
                distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
                map(dp => {
                    const namesAndTypesMap: {
                        [name: string]: LocalizedItemEntry
                    } = {
                        params: {},
                        events: {}
                    };
                    if (dp.param_types) {
                        for (const param of dp.param_types) {
                            namesAndTypesMap.params[param.id] = {
                                name: this.dpTranslateService.getTranslation('param', param.name),
                                type: param.value_type || ValueType.Integer
                            };
                            if (param.value_unit) {
                                namesAndTypesMap.params[param.id].unit = this.dpTranslateService.getTranslation('unit', param.value_unit);
                            }
                        }
                    }
                    if (dp.event_types) {
                        for (const event of dp.event_types) {
                            namesAndTypesMap.events[event.id] = {
                                name: this.dpTranslateService.getTranslation('param', event.name),
                                type: <ValueType>event.value_type || ValueType.Integer
                            };
                            if (event.value_unit) {
                                namesAndTypesMap.events[event.id].unit = this.dpTranslateService.getTranslation('unit', event.value_unit);
                            }
                        }
                    }
                    return namesAndTypesMap;
                })
            ),
        );
        this.params$ = combineLatest(
            this.dmService.params$.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))),
            dpParamsAndEvents
        ).pipe(
            map(([params, [lang, dpParamNames]]) => {
                for (const param of params) {
                    param.name = dpParamNames.params.hasOwnProperty(param.typ) ? dpParamNames.params[param.typ].name : param.id.toString();
                    param.type = dpParamNames.params.hasOwnProperty(param.typ) ? dpParamNames.params[param.typ].type : ValueType.Integer;
                    if (dpParamNames.params.hasOwnProperty(param.typ) && dpParamNames.params[param.typ].unit) {
                        param.unit = dpParamNames.params[param.typ].unit;
                    }
                }
                return params;
            })
        );
        this.events$ = combineLatest(
            this.dmService.events$.pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))),
            dpParamsAndEvents
        ).pipe(
            map(([events, [lang, dpParamNames]]) => {
                for (const event of events) {
                    event.name = dpParamNames.events.hasOwnProperty(event.typ) ? dpParamNames.events[event.typ].name : event.id.toString();
                    event.type = dpParamNames.events.hasOwnProperty(event.typ) ? dpParamNames.events[event.typ].type : ValueType.Integer;
                    if (dpParamNames.events.hasOwnProperty(event.typ) && dpParamNames.events[event.typ].unit) {
                        event.unit = dpParamNames.events[event.typ].unit;
                    }
                }
                return events;
            })
        );
    }

    ngOnInit() {
        const dateParam = new Date(this.route.snapshot.queryParams['date']);
        if (!isNaN(dateParam.getTime())) { this.dmService.setDate(moment(dateParam)); }
        const liveParam = this.route.snapshot.queryParams['live'] === 'true';
        if (liveParam) { this.dmService.setLive(liveParam); }
        if (!this.dmService.date) { this.dmService.setLive(true); }
        this.mainPanelType$ = new BehaviorSubject(this.route.snapshot.queryParams['main'] || MainPanelType.Splitted);
        this.sidePanelType$ = new BehaviorSubject(this.route.snapshot.queryParams['side'] || SidePanelType.Events);
        this.sidePanelOpened$ = new BehaviorSubject(this.route.snapshot.queryParams['side_opened'] === 'true');

        this.subs.add(combineLatest(
            this.dmService.live$,
            this.dmService.date$,
            this.mainPanelType$.asObservable(),
            this.sidePanelType$.asObservable(),
            this.sidePanelOpened$.asObservable()
        )
            .pipe(debounceTime(10))
            .subscribe(([live, date, main, side, side_opened]) => {
                const queryParams = { live, date: date ? date.toISOString() : null, main, side, side_opened };
                this.router.navigate([], {
                    queryParams,
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                });
            }));

        this.objectsService.init();
        this.dataprofilesService.init();
        this.dmService.init();
        this.dmService.setLiveActive(true);

        this.subs.add(this.media.asObservableMain().subscribe(changes => {
            if (changes.aliases.includes('lt-sm') && this.sidePanelOpened) {
                this.toggleSidePanelOpened(false);
                if (this.sidePanelType === SidePanelType.Map) {
                    this.setMainPanelType(MainPanelType.Map);
                }
            } else if (changes.aliases.includes('gt-xs')) {
                if (this.mainPanelType === MainPanelType.Map) {
                    this.setMainPanelType(MainPanelType.Summary);
                }
            }
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();

        this.dmService.setLiveActive(false);
    }

    private _objectToItem(object: ControlObject): ListContainerItem {
        const it: ListContainerItem = new ListContainerItem();
        it.id = object.id;
        it.title = object.name;
        it.subtitle = this.translate.instant('OBJECT_TYPE_' + object.type.replace(' ', '_').toUpperCase());
        return it;
    }

    public prevPeriod() {
        const d = this.dmService.date.subtract(1, 'd');
        this.dmService.setDate(d);
    }

    public currentPeriod() {
        this.dmService.setLive(true);
    }

    public nextPeriod() {
        const d = this.dmService.date.add(1, 'd');
        this.dmService.setDate(d);
    }

    public get mainPanelType(): MainPanelType {
        return this.mainPanelType$.getValue();
    }

    public get sidePanelType(): SidePanelType {
        return this.sidePanelType$.getValue();
    }

    public get sidePanelOpened(): boolean {
        return this.sidePanelOpened$.getValue();
    }

    public setMainPanelType(mode: MainPanelType) {
        this.mainPanelType$.next(mode);
    }

    public setSidePanelType(mode: SidePanelType) {
        this.sidePanelType$.next(mode);
    }

    public toggleSidePanelOpened(val?: boolean) {
        const s = typeof val !== 'undefined' ? val : !this.sidePanelOpened$.getValue();
        this.sidePanelOpened$.next(s);
    }

    public dateChanged(time: string) {
        this.form.get('time').setValue(time);
    }

}
