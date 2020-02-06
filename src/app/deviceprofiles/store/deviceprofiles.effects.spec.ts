import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { IqsDeviceprofilesEffects } from './deviceprofiles.effects';
import * as fromDeviceprofilesActions from './deviceprofiles.actions';
import { IqsDeviceprofilesDataService } from '../services';
import { utils, IqsDeviceprofilesDataServiceMock } from '../../../mock';

describe('[Deviceprofiles] store/effects', () => {

    const organization_id = '00000000000000000000000000000000';
    const error = 'custom error';
    let effects: IqsDeviceprofilesEffects;
    let actions: Observable<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IqsDeviceprofilesEffects,
                provideMockActions(() => actions),
                {
                    provide: IqsDeviceprofilesDataService,
                    useClass: IqsDeviceprofilesDataServiceMock
                },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParams: {} } }
                }
            ],
        });

        effects = TestBed.get(IqsDeviceprofilesEffects);
        resetToCurrentDefault();
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        ds.init({ organization_id, error });
    });

    it('deviceprofiles$', () => {
        const expectedBaseDeviceprofiles = utils.deviceprofiles.getBaseDeviceProfiles();
        const expectedDeviceprofiles = utils.deviceprofiles.findByOrganizationId(organization_id);
        const ds: IqsDeviceprofilesDataServiceMock = TestBed.get(IqsDeviceprofilesDataService);
        const action = new fromDeviceprofilesActions.DeviceprofilesInitAction();
        const completion = new fromDeviceprofilesActions.DeviceprofilesSuccessAction({
            base: expectedBaseDeviceprofiles,
            profiles: expectedDeviceprofiles
        });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.deviceprofiles$).toBeObservable(expected);
        spyOn(ds, 'readDeviceProfiles').and.callFake(ds.throwError);
        const completion_fail = new fromDeviceprofilesActions.DeviceprofilesFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.deviceprofiles$).toBeObservable(expected);
    });
});
