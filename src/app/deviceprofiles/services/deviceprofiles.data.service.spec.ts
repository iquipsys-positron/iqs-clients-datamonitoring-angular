import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SESSION_CONFIG, DEFAULT_SESSION_CONFIG, IqsOrganizationsService } from 'iqs-libs-clientshell2-angular';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { LocalStorageModule } from 'angular-2-local-storage';
import cloneDeep from 'lodash/cloneDeep';
import { CookieService } from 'ngx-cookie-service';

import { IqsDeviceprofilesDataService } from './deviceprofiles.data.service';
import { BaseDeviceProfile, DeviceProfile } from '../models';
import { utils, mockDeviceprofilesProvider } from '../../../mock';

describe('[Deviceprofiles] services/deviceprofiles.data', () => {

    const organization_id = '00000000000000000000000000000000';
    let service: IqsDeviceprofilesDataService;
    let expectedBaseDeviceprofiles: BaseDeviceProfile[];
    let expectedDeviceprofiles: DeviceProfile[];

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            LocalStorageModule.withConfig({
                prefix: 'iqs-clients2',
                storageType: 'localStorage'
            })
        ],
        providers: [
            CookieService,
            mockDeviceprofilesProvider,
            {
                provide: SESSION_CONFIG,
                useValue: DEFAULT_SESSION_CONFIG
            },
            {
                provide: IqsOrganizationsService,
                useValue: {
                    current: {
                        id: organization_id
                    }
                }
            }
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDeviceprofilesDataService);
        resetToCurrentDefault();
        expectedBaseDeviceprofiles = utils.deviceprofiles.getBaseDeviceProfiles();
        expectedDeviceprofiles = cloneDeep(utils.deviceprofiles.findByOrganizationId(organization_id));
    });

    it('should read base deviceprofiles', done => {
        service.readBaseDeviceProfiles().subscribe(dps => {
            expect(dps).toEqual(expectedBaseDeviceprofiles);
            done();
        });
    });

    it('should read deviceprofiles', done => {
        service.readDeviceProfiles().subscribe(dps => {
            expect(dps).toEqual(expectedDeviceprofiles);
            done();
        });
    });

});
