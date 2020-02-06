import { Observable, of, throwError } from 'rxjs';

import * as utils from '../utility';
import { DataProfile } from '../../app/dataprofiles';

export class IqsDataprofilesDataServiceMock {

    private organization_id: string;
    private error: any;

    public init(payload: {
        organization_id: string,
        error: any
    }) {
        this.organization_id = payload.organization_id;
        this.error = payload.error;
    }

    public readDataprofiles(): Observable<DataProfile> {
        return of(utils.dataprofiles.findByOrganizationId(this.organization_id));
    }

    public updateDataprofiles(data: DataProfile): Observable<DataProfile> {
        return of(utils.dataprofiles.updateByOrganizationId(this.organization_id, data));
    }

    public throwError(): Observable<DataProfile> {
        return throwError(this.error);
    }
}
