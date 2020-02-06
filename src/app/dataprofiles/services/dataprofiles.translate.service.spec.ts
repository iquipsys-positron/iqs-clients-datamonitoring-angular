import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { IqsDataprofilesTranslateService } from './dataprofiles.translate.service';

describe('[Dataprofiles] services/dataprofiles.translate', () => {

    let service: IqsDataprofilesTranslateService;

    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            TranslateModule.forRoot()
        ],
        providers: [
            IqsDataprofilesTranslateService
        ]
    }));

    beforeEach(() => {
        service = TestBed.get(IqsDataprofilesTranslateService);
    });

    it('should return right translateions', () => {
        const translate: TranslateService = TestBed.get(TranslateService);
        const translations = {
            'DATAPROFILES_PARAM_A': 'Param a',
            'DATAPROFILES_UNIT_x': 'Unit x'
        };
        translate.setTranslation('en', translations);
        translate.use('en');
        expect(service.getTranslation('param', undefined)).toEqual('');
        expect(service.getTranslation('param', 'a')).toEqual(translations['DATAPROFILES_PARAM_A']);
        expect(service.getTranslation('unit', 'x')).toEqual(translations['DATAPROFILES_UNIT_x']);
        expect(service.getTranslation('param', 'not here')).toEqual('not here');
    });

});
