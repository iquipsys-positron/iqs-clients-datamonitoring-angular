import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IqsSessionConfigService, CommonDataService, IqsOrganizationsService, DataPage } from 'iqs-libs-clientshell2-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseDeviceProfile, DeviceProfile } from '../models';

@Injectable({
    providedIn: 'root'
})
export class IqsDeviceprofilesDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:organization_id/devices/profiles';
    private RESOURCE_BASE = '/api/v1/organizations/:organization_id/devices/profiles/base';

    constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    public readBaseDeviceProfiles(): Observable<BaseDeviceProfile[]> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.get<BaseDeviceProfile[]>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE_BASE, params));
    }

    public readDeviceProfiles(): Observable<DeviceProfile[]> {
        const params = {
            organization_id: this.organizationsService.current && this.organizationsService.current.id
        };

        return this.http.get<DataPage<DeviceProfile>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, params))
            .pipe(
                map(res => res.data)
            );
    }
}
