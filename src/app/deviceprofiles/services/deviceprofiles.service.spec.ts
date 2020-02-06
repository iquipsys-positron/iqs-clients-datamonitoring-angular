import { TestBed } from '@angular/core/testing';
import { IqsOrganizationsService, EntityState } from 'iqs-libs-clientshell2-angular';
import { MockOrganizationsService } from 'iqs-libs-clientshell2-angular/mock';
import { Store, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import cloneDeep from 'lodash/cloneDeep';
import { filter, map } from 'rxjs/operators';

import { IqsDeviceprofilesService } from './deviceprofiles.service';
import {
    DeviceprofilesInitAction,
    DeviceprofilesState,
    deviceprofilesInitialState
} from '../store/index';
import { utils, IqsDataprofilesServiceMock } from '../../../mock';
import { IqsDataprofilesService } from '../../dataprofiles';
import { DeviceProfile, BaseDeviceProfile } from '../models';

describe('[Deviceprofiles] services/deviceprofiles', () => {

    const organization_id = '00000000000000000000000000000000';
    let service: IqsDeviceprofilesService;
    let store: MockStore<DeviceprofilesState>;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [],
        providers: [
            IqsDeviceprofilesService,
            {
                provide: IqsOrganizationsService,
                useClass: MockOrganizationsService
            },
            {
                provide: IqsDataprofilesService,
                useClass: IqsDataprofilesServiceMock
            },
            provideMockStore()
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDeviceprofilesService);
        store = TestBed.get(Store);
        spyOn(store, 'select').and.callFake((selector: MemoizedSelector<DeviceprofilesState, any>) => {
            return store.pipe(
                filter(s => !!s),
                map(s => selector.projector(s))
            );
        });
    });

    it('should init', () => {
        const organizationsSerivce: MockOrganizationsService = TestBed.get(IqsOrganizationsService);
        const dataprofilesService: IqsDataprofilesServiceMock = TestBed.get(IqsDataprofilesService);
        const dispatchSpy = spyOn(store, 'dispatch');
        service.init();
        dataprofilesService.init({ organization_id });
        expect(IqsDeviceprofilesService.dpUpdateSub).toBeTruthy();
        expect(dispatchSpy).toHaveBeenCalledWith(new DeviceprofilesInitAction());
        const organizationsServiceInitSpy = spyOn(organizationsSerivce, 'init');
        service.init();
        expect(organizationsServiceInitSpy).not.toHaveBeenCalled();
    });

    it('should return deviceprofiles$', () => {
        const deviceprofiles = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
        store.setState({
            ...deviceprofilesInitialState,
            profiles: deviceprofiles
        });
        let profiles: DeviceProfile[];
        service.deviceprofiles$.subscribe(p => profiles = p);
        expect(profiles).toEqual(deviceprofiles);
        store.setState({
            ...deviceprofilesInitialState,
            profiles: [deviceprofiles[0]]
        });
        expect(profiles).toEqual([deviceprofiles[0]]);
    });

    it('should return baseDeviceprofiles$', () => {
        const baseDeviceprofiles = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        store.setState({
            ...deviceprofilesInitialState,
            base: baseDeviceprofiles
        });
        let profiles: BaseDeviceProfile[];
        service.baseDeviceprofiles$.subscribe(p => profiles = p);
        expect(profiles).toEqual(baseDeviceprofiles);
        store.setState({
            ...deviceprofilesInitialState,
            base: [baseDeviceprofiles[0]]
        });
        expect(profiles).toEqual([baseDeviceprofiles[0]]);
    });

    it('should return state$', () => {
        store.setState({
            ...deviceprofilesInitialState
        });
        let state: EntityState;
        service.state$.subscribe(s => state = s);
        expect(state).toEqual(EntityState.Empty);
        store.setState({
            ...deviceprofilesInitialState,
            state: EntityState.Data
        });
        expect(state).toEqual(EntityState.Data);
    });

    it('should return error$', () => {
        store.setState({
            ...deviceprofilesInitialState
        });
        let error: any;
        service.error$.subscribe(e => error = e);
        expect(error).toEqual(null);
        store.setState({
            ...deviceprofilesInitialState,
            error: 'error'
        });
        expect(error).toEqual('error');
    });

    it('should return base profile by id', () => {
        const baseDeviceprofiles: BaseDeviceProfile[] = cloneDeep(utils.deviceprofiles.getBaseDeviceProfiles());
        const customBaseProfile = baseDeviceprofiles.find(dp => dp.id === 'custom');
        store.setState(deviceprofilesInitialState);
        expect(service.getBaseProfileById('custom')).toBeFalsy();
        store.setState({
            ...deviceprofilesInitialState,
            base: baseDeviceprofiles
        });
        expect(service.getBaseProfileById('bad id')).toBeFalsy();
        expect(service.getBaseProfileById('custom')).toEqual(customBaseProfile);
    });

});
