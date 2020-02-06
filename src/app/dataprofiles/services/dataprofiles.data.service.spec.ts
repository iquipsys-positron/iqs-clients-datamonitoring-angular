import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SESSION_CONFIG, DEFAULT_SESSION_CONFIG, IqsOrganizationsService } from 'iqs-libs-clientshell2-angular';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { LocalStorageModule } from 'angular-2-local-storage';
import cloneDeep from 'lodash/cloneDeep';
import { CookieService } from 'ngx-cookie-service';

import { IqsDataprofilesDataService } from './dataprofiles.data.service';
import { DataProfile } from '../models';
import { utils, mockDataprofilesProvider } from '../../../mock';

describe('[Dataprofiles] services/dataprofiles.data', () => {

    const organization_id = '00000000000000000000000000000000';
    let service: IqsDataprofilesDataService;
    let expectedDataprofiles: DataProfile;

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
            mockDataprofilesProvider,
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
        service = TestBed.get(IqsDataprofilesDataService);
        resetToCurrentDefault();
        expectedDataprofiles = cloneDeep(utils.dataprofiles.findByOrganizationId(organization_id));
    });

    it('should read dataprofiles', done => {
        service.readDataprofiles().subscribe(dps => {
            expect(dps).toEqual(expectedDataprofiles);
            done();
        });
    });

    it('should update dataprofiles', done => {
        expectedDataprofiles.param_types = [];
        delete expectedDataprofiles.id;
        service.updateDataprofiles(expectedDataprofiles).subscribe(dps => {
            expect(dps).toEqual({...expectedDataprofiles, id: organization_id});
            done();
        });
    });
});
