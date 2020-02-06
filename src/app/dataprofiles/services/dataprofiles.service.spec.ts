import { TestBed } from '@angular/core/testing';
import { IqsOrganizationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { MockOrganizationsService } from 'iqs-libs-clientshell2-angular/mock';
import { Store, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CookieService } from 'ngx-cookie-service';
import { filter, map } from 'rxjs/operators';

import { IqsDataprofilesService } from './dataprofiles.service';
import {
    DataprofilesUpdateAction,
    DataprofilesState,
    getDataprofilesData,
    getDataprofilesError,
    getDataprofilesState,
} from '../store/index';
import { utils, resetToCurrentDefault } from '../../../mock';
import { DataProfileType } from '../models';

describe('[Dataprofiles] services/dataprofiles', () => {

    const organization_id = '00000000000000000000000000000000';
    let service: IqsDataprofilesService;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [],
        providers: [
            CookieService,
            IqsDataprofilesService,
            {
                provide: IqsOrganizationsService,
                useClass: MockOrganizationsService
            },
            provideMockStore()
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDataprofilesService);
        resetToCurrentDefault();
    });

    it('should init', () => {
        const organizationsSerivce: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        service.init();
        expect(IqsDataprofilesService.dpUpdateSub).toBeTruthy();
        const organizationsServiceInitSpy = spyOn(organizationsSerivce, 'init');
        service.init();
        expect(organizationsServiceInitSpy).not.toHaveBeenCalled();
    });

    it('should call store', () => {
        const store: MockStore<DataprofilesState> = TestBed.get(Store);
        expect(store).toBeTruthy();
        const storeSelectSpy = spyOn(store, 'select');
        const dataprofiles$ = service.dataprofiles$;
        expect(storeSelectSpy).toHaveBeenCalledWith(getDataprofilesData);
        const state$ = service.state$;
        expect(storeSelectSpy).toHaveBeenCalledWith(getDataprofilesState);
        const error$ = service.error$;
        expect(storeSelectSpy).toHaveBeenCalledWith(getDataprofilesError);
    });

    it('should find param by id', () => {
        const expectedDataprofiles = utils.dataprofiles.findByOrganizationId(organization_id);
        const store: MockStore<DataprofilesState> = TestBed.get(Store);
        spyOn(store, 'select').and.callFake((selector: MemoizedSelector<DataprofilesState, any>, props?: any) => {
            return store.pipe(
                filter(s => !!s),
                map(s => selector.projector(s, props))
            );
        });
        store.setState({
            dataprofiles: expectedDataprofiles,
            state: EntityState.Empty,
            error: null,
        });
        let param = service.findParamById(Number.MAX_SAFE_INTEGER);
        expect(param).toEqual(null);
        param = service.findParamById(expectedDataprofiles.param_types[0].id);
        expect(param).toEqual(expectedDataprofiles.param_types[0]);
    });

    it('should get type by id', () => {
        const expectedDataprofiles = utils.dataprofiles.findByOrganizationId(organization_id);
        const store: MockStore<DataprofilesState> = TestBed.get(Store);
        spyOn(store, 'select').and.callFake((selector: MemoizedSelector<DataprofilesState, any>) => {
            return store.pipe(
                filter(s => !!s),
                map(s => selector.projector(s))
            );
        });
        store.setState({
            dataprofiles: expectedDataprofiles,
            state: EntityState.Empty,
            error: null,
        });
        const command = service.getTypeById(DataProfileType.Command, expectedDataprofiles.command_types[0].id);
        expect(command).toEqual(expectedDataprofiles.command_types[0]);
        const event = service.getTypeById(DataProfileType.Event, expectedDataprofiles.event_types[0].id);
        expect(event).toEqual(expectedDataprofiles.event_types[0]);
        const parameter = service.getTypeById(DataProfileType.Parameter, expectedDataprofiles.param_types[0].id);
        expect(parameter).toEqual(expectedDataprofiles.param_types[0]);
        const state = service.getTypeById(DataProfileType.State, expectedDataprofiles.state_types[0].id);
        expect(state).toEqual(expectedDataprofiles.state_types[0]);
        const state2 = service.getTypeById(DataProfileType.State, -5);
        expect(state2).toEqual(null);
        const unknown = service.getTypeById(<DataProfileType>'unknown', -5);
        expect(unknown).toEqual(null);
    });

    it('should call update dataprofiles', () => {
        const store: MockStore<DataprofilesState> = TestBed.get(Store);
        expect(store).toBeTruthy();
        const storeDispatchSpy = spyOn(store, 'dispatch');
        service.update(<any>{});
        expect(storeDispatchSpy).toHaveBeenCalledWith(new DataprofilesUpdateAction({ dataprofiles: <any>{} }));
    });

});
