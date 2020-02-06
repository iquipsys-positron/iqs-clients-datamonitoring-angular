import { Component, OnInit, OnDestroy, NgZone, ElementRef, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IqsCurrentObjectStatesService,
    IqsControlObjectsService,
    IqsObjectGroupsService,
    IqsZonesService,
    EntityState,
    IqsShellService,
    IqsSessionConfigService,
    ControlObjectType,
} from 'iqs-libs-clientshell2-angular';
import { TranslateService } from '@ngx-translate/core';
import sortBy from 'lodash/sortBy';
import { PipMediaService, PipSidenavService } from 'pip-webui2-layouts';
import { PipNavService } from 'pip-webui2-nav';
import { Observable, combineLatest, BehaviorSubject, Subscription, of } from 'rxjs';
import { map, debounceTime, startWith, switchMap } from 'rxjs/operators';

import { datamonitoringListContainerTranslations } from './list-container.strings';
import { containersTranslations } from '../containers.strings';
import { ListContainerItemsGroup, ListContainerViewType, ListContainerItemParam } from '../../models';
import { trackBy } from '../../../common';
import { IqsDataprofilesService, ValueType, IqsDataprofilesTranslateService } from '../../../dataprofiles';
import { IqsDeviceprofilesService } from '../../../deviceprofiles';
import { LocalStorageService } from 'angular-2-local-storage';

interface ListOption {
    value: string;
    display: string;
}

@Component({
    selector: 'iqs-list-container',
    templateUrl: './list-container.component.html',
    styleUrls: ['./list-container.component.scss']
})
export class IqsDatamonitoringListContainerComponent implements OnInit, OnDestroy {

    private subs: Subscription;
    private _objectTypes$: BehaviorSubject<ListOption[]> = new BehaviorSubject([]);
    private _parameterlessGroups$: Observable<ListContainerItemsGroup[]>;

    public blobsUrl: string;
    public isAnimated = false;
    public trackById = trackBy('id');
    public width = 0;
    public autocompleteActive$: Observable<boolean>;
    public autocompleteToggle$: BehaviorSubject<boolean>;
    public autocompleteOptions$: Observable<ListOption[]>;
    public allGroups$: Observable<ListContainerItemsGroup[]>;
    public groups$: Observable<ListContainerItemsGroup[]>;
    public search: FormControl;
    public state$: Observable<EntityState>;
    public view$: BehaviorSubject<ListContainerViewType>;

    constructor(
        public media: PipMediaService,

        private dpTranslate: IqsDataprofilesTranslateService,
        private elRef: ElementRef,
        private ls: LocalStorageService,
        private nav: PipNavService,
        private ngZone: NgZone,
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
        private sessionConfig: IqsSessionConfigService,
        private shell: IqsShellService,
        private sidenav: PipSidenavService,
        private translate: TranslateService,

        private dataprofilesService: IqsDataprofilesService,
        private deviceprofilesService: IqsDeviceprofilesService,
        private currentObjectStatesService: IqsCurrentObjectStatesService,
        private objectsService: IqsControlObjectsService,
        private objectGroupsService: IqsObjectGroupsService,
        private zonesService: IqsZonesService
    ) {
        this.subs = new Subscription();
        this.blobsUrl = this.sessionConfig.serverUrl + '/api/v1/blobs/';

        this.translate.setTranslation('en', datamonitoringListContainerTranslations.en, true);
        this.translate.setTranslation('en', containersTranslations.en, true);
        this.translate.setTranslation('ru', datamonitoringListContainerTranslations.ru, true);
        this.translate.setTranslation('ru', containersTranslations.ru, true);
        this.translate.onLangChange.subscribe(payload => {
            this._updateObjectTypesList();
        });
        this._updateObjectTypesList();

        this.nav.showTitle('DATAMONITORING_LIST_TITLE');
        this.nav.showNavIcon({
            icon: 'menu',
            action: () => {
                this.sidenav.toggleOpened();
            }
        });
        this.state$ = combineLatest(
            this.objectsService.state$,
            this.objectGroupsService.state$
        ).pipe(
            map(([os, gs]) => {
                if (os === EntityState.Progress || gs === EntityState.Progress) {
                    return EntityState.Progress;
                } else if (os === EntityState.Empty) {
                    return EntityState.Empty;
                } else {
                    return EntityState.Data;
                }
            })
        );

        this.search = new FormControl('');
        this.autocompleteToggle$ = new BehaviorSubject(false);
        this.autocompleteOptions$ = combineLatest(
            this.search.valueChanges.pipe(startWith(''), debounceTime(100)),
            this.autocompleteToggle$.asObservable(),
            this._objectTypes$.asObservable()
        ).pipe(
            switchMap(([filter, isOpened, types]) => {
                if (filter.length < 3) {
                    if (isOpened) {
                        return of(types);
                    } else {
                        return of([]);
                    }
                } else {
                    const r = new RegExp(`(${filter})`, 'i');
                    return combineLatest(
                        this.objectsService.objects$,
                        this.objectGroupsService.groups$
                    ).pipe(
                        map(([objects, groups]) => {
                            const ret: ListOption[] = [];
                            ret.push(...types.filter(t => r.test(t.value)));
                            ret.push(...objects.filter(o => r.test(o.name))
                                .map(o => ({ value: o.name, display: o.name.replace(r, '<b>$1</b>') })));
                            ret.push(...groups.filter(g => r.test(g.name))
                                .map(g => ({ value: g.name, display: g.name.replace(r, '<b>$1</b>') })));
                            return ret;
                        })
                    );
                }
            })
        );

        const viewType = this.route.snapshot.queryParams['view'] || this.ls.get('view') || ListContainerViewType.List;
        this.view$ = new BehaviorSubject(viewType);
        this.subs.add(this.view$.pipe(
            debounceTime(10)
        ).subscribe(vt => {
            if (vt === ListContainerViewType.List) {
                this.shell.setShadows({ top: false });
                this.renderer.removeClass(this.elRef.nativeElement, 'view-grid');
                this.renderer.removeClass(this.elRef.nativeElement, 'view-dashboard');
                this.renderer.addClass(this.elRef.nativeElement, 'view-list');
                this.currentObjectStatesService.stopLive();
            } else {
                this.shell.setShadows({ top: true });
                this.renderer.removeClass(this.elRef.nativeElement, 'view-list');
                this.renderer.removeClass(this.elRef.nativeElement, 'view-dashboard');
                this.renderer.addClass(this.elRef.nativeElement, 'view-grid');
                this.currentObjectStatesService.startLive();
            }
            this.ls.set('view', vt);
            this.ngZone.run(() => this.router.navigate([], {
                queryParams: { view: vt },
                queryParamsHandling: 'merge'
            }));
        }));

        this._parameterlessGroups$ = combineLatest(
            this.objectsService.objects$,
            this.objectGroupsService.groups$
        ).pipe(
            map(([objects, groups]) => {
                if (!groups || !groups.length || !objects || !objects.length) { return []; }
                const ret: ListContainerItemsGroup[] = [];
                const objectsIdxMap = objects.reduce((acc, val, idx) => { acc[val.id] = { idx, present: false }; return acc; }, {});
                for (const group of groups) {
                    const g: ListContainerItemsGroup = new ListContainerItemsGroup();
                    g.id = group.id;
                    g.name = group.name;
                    for (const oid of group.object_ids) {
                        const o = objects[objectsIdxMap[oid].idx];
                        objectsIdxMap[oid].present = true;
                        g.items.push({
                            id: o.id,
                            title: o.name,
                            subtitle: this.translate.instant('OBJECT_TYPE_' + o.type.replace(' ', '_').toUpperCase()),
                        });
                    }
                    if (g.items.length) { ret.push(g); }
                }
                const notPresentObjectKeys = Object.keys(objectsIdxMap).filter(key => !objectsIdxMap[key].present);
                if (notPresentObjectKeys.length) {
                    const g: ListContainerItemsGroup = new ListContainerItemsGroup();
                    g.id = null;
                    g.name = 'OBJECT_GROUP_UNDEFINED';
                    for (const oid of notPresentObjectKeys) {
                        const o = objects[objectsIdxMap[oid].idx];
                        objectsIdxMap[oid].present = true;
                        g.items.push({
                            id: o.id,
                            title: o.name,
                            subtitle: this.translate.instant('OBJECT_TYPE_' + o.type.replace(' ', '_').toUpperCase()),
                        });
                    }
                    ret.push(g);
                }
                return ret;
            })
        );
        this.allGroups$ = this.view$.pipe(
            switchMap(view => {
                if (view === ListContainerViewType.List) {
                    return this._parameterlessGroups$;
                } else {
                    return combineLatest(
                        this._parameterlessGroups$,
                        this.currentObjectStatesService.states$
                    ).pipe(
                        map(([groups, states]) => {
                            const objectsInGroupsMap: { [object_id: string]: { oid: number, gid: number }[] } = {};
                            groups.forEach((g, gid) => {
                                g.items.forEach((o, oid) => {
                                    if (!objectsInGroupsMap.hasOwnProperty(o.id)) {
                                        objectsInGroupsMap[o.id] = [];
                                    }
                                    objectsInGroupsMap[o.id].push({ oid, gid });
                                });
                            });
                            for (const state of states) {
                                if (!objectsInGroupsMap.hasOwnProperty(state.object_id) || !state.params) { continue; }
                                const params: ListContainerItemParam[] = [];
                                for (const param of state.params) {
                                    if (!param.typ || !param.id) { continue; }
                                    const p: ListContainerItemParam = {
                                        name: '',
                                        value: '-'
                                    };
                                    if (param.typ) {
                                        const dp = this.dataprofilesService.findParamById(param.typ);
                                        p.name = this.dpTranslate.getTranslation('param', dp.name);
                                        if (param.hasOwnProperty('val')) {
                                            switch (dp.value_type) {
                                                case ValueType.Boolean:
                                                    p.value = this.translate.instant('VALUE_TYPE_BOOLEAN_' + (param.val ? 'YES' : 'NO'));
                                                    break;
                                                case ValueType.Float:
                                                    p.value = parseFloat(param.val.toFixed(4)).toString();
                                                    break;
                                                default:
                                                    p.value = param.val.toString();
                                                    break;
                                            }
                                            if (dp.value_unit) {
                                                p.value += ' ' + this.dpTranslate.getTranslation('unit', dp.value_unit);
                                            }
                                        }
                                    }
                                    params.push(p);
                                }
                                for (const o of objectsInGroupsMap[state.object_id]) {
                                    groups[o.gid].items[o.oid].params = params;
                                }
                            }
                            return groups;
                        })
                    );
                }
            })
        );
        this.groups$ = combineLatest(
            this.allGroups$,
            this.search.valueChanges.pipe(startWith(''), debounceTime(100))
        ).pipe(
            map(([groups, filter]) => {
                const r = new RegExp(filter === this.translate.instant('OBJECT_TYPE_ANY') ? '.' : filter, 'i');
                const filtered: ListContainerItemsGroup[] = [];
                for (const group of groups) {
                    const items = group.items.filter(it => r.test(it.title) || r.test(it.subtitle));
                    if (items && items.length) {
                        filtered.push({
                            id: group.id,
                            name: group.name,
                            items
                        });
                    }
                }
                if (!this.isAnimated) {
                    setTimeout(() => { this.isAnimated = true; }, 1000);
                }
                return filtered;
            })
        );
    }

    ngOnInit() {
        this.currentObjectStatesService.init();
        this.dataprofilesService.init();
        this.deviceprofilesService.init();
        this.objectsService.init();
        this.objectGroupsService.init();
        this.zonesService.init();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();

        this.currentObjectStatesService.stopLive();
    }

    private _updateObjectTypesList() {
        let objectTypes: ListOption[] = [];
        let t;
        for (const type of Object.values(ControlObjectType)) {
            t = this.translate.instant('OBJECT_TYPE_' + type.replace(' ', '_').toUpperCase());
            objectTypes.push({ value: t, display: t });
        }
        objectTypes = sortBy(objectTypes, ['value']);
        t = this.translate.instant('OBJECT_TYPE_ANY');
        objectTypes.unshift({ value: t, display: t });
        this._objectTypes$.next(objectTypes);
    }

    public onResize(tilesLayoutSize: number) {
        if (typeof tilesLayoutSize !== 'undefined' && tilesLayoutSize !== null) {
            this.width = tilesLayoutSize;
        }
    }

    public toggleAutocomplete() {
        this.autocompleteToggle$.next(!this.autocompleteToggle$.getValue());
    }

    public setAutocomplete(state: boolean) {
        this.autocompleteToggle$.next(state);
    }

}
