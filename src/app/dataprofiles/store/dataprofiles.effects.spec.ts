import { TestBed } from '@angular/core/testing';
import { resetToCurrentDefault } from 'iqs-libs-clientshell2-angular/mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { IqsDataprofilesEffects } from './dataprofiles.effects';
import * as fromDataprofilesActions from './dataprofiles.actions';
import { IqsDataprofilesDataService } from '../services';
import { utils, IqsDataprofilesDataServiceMock } from '../../../mock';

describe('[Dataprofiles] store/effects', () => {

    const organization_id = '00000000000000000000000000000000';
    const error = 'custom error';
    let effects: IqsDataprofilesEffects;
    let actions: Observable<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IqsDataprofilesEffects,
                provideMockActions(() => actions),
                IqsDataprofilesDataService,
                {
                    provide: IqsDataprofilesDataService,
                    useClass: IqsDataprofilesDataServiceMock
                }
            ],
        });

        effects = TestBed.get(IqsDataprofilesEffects);
        resetToCurrentDefault();
        const ds: IqsDataprofilesDataServiceMock = TestBed.get(IqsDataprofilesDataService);
        ds.init({ organization_id, error });
    });

    it('dataprofiles$', () => {
        const expectedDataprofiles = utils.dataprofiles.findByOrganizationId(organization_id);
        const ds: IqsDataprofilesDataServiceMock = TestBed.get(IqsDataprofilesDataService);
        const action = new fromDataprofilesActions.DataprofilesInitAction();
        const completion = new fromDataprofilesActions.DataprofilesSuccessAction({ dataprofiles: expectedDataprofiles });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.dataprofiles$).toBeObservable(expected);
        spyOn(ds, 'readDataprofiles').and.callFake(ds.throwError);
        const completion_fail = new fromDataprofilesActions.DataprofilesFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.dataprofiles$).toBeObservable(expected);
    });

    it('dataprofilesUpdate$', () => {
        const expectedDataprofiles = utils.dataprofiles.findByOrganizationId(organization_id);
        const ds: IqsDataprofilesDataServiceMock = TestBed.get(IqsDataprofilesDataService);
        const action = new fromDataprofilesActions.DataprofilesUpdateAction({ dataprofiles: expectedDataprofiles });
        const completion = new fromDataprofilesActions.DataprofilesUpdateSuccessAction({ dataprofiles: expectedDataprofiles });

        actions = hot('--a|', { a: action });
        let expected = cold('--b|', { b: completion });

        expect(effects.dataprofilesUpdate$).toBeObservable(expected);
        spyOn(ds, 'updateDataprofiles').and.callFake(ds.throwError);
        const completion_fail = new fromDataprofilesActions.DataprofilesUpdateFailureAction({ error });

        actions = hot('--a|', { a: action });
        expected = cold('-----b|', { b: completion_fail });
        expect(effects.dataprofilesUpdate$).toBeObservable(expected);
    });

});
