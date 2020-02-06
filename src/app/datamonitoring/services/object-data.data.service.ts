import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IqsSessionConfigService, CommonDataService, IqsOrganizationsService, DataPage } from 'iqs-libs-clientshell2-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ObjectData } from '../models';

@Injectable({
    providedIn: 'root'
})
export class IqsObjectDataDataService extends CommonDataService {

    private RESOURCE = '/api/v1/organizations/:org_id/object_data';

    constructor(
        private sessionConfig: IqsSessionConfigService,
        private organizationsService: IqsOrganizationsService,
        private http: HttpClient,
    ) { super(); }

    public readData(params?: any): Observable<ObjectData[]> {
        const urlParams = {
            sitorg_ide_id: params.organization_id || (this.organizationsService.current && this.organizationsService.current.id) || null
        };
        return this.http.get<DataPage<ObjectData>>(this.buildUrl(this.sessionConfig.serverUrl + this.RESOURCE, urlParams), { params })
            .pipe(
                map(res => res['data'])
            );
    }
}
