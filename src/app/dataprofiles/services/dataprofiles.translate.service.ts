import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { dataprofilesTranslations } from './dataprofiles.strings';

@Injectable()
export class IqsDataprofilesTranslateService {

    static dpUpdateSub = null;

    constructor(
        private translate: TranslateService
    ) {
        this.translate.setTranslation('en', dataprofilesTranslations.en, true);
        this.translate.setTranslation('ru', dataprofilesTranslations.ru, true);
    }

    public getTranslation(type: string, key: string, interpolatedParams?: any) {
        if (!key) { return ''; }
        const t = 'DATAPROFILES_' + type.toUpperCase() + '_' + (type === 'unit' ? key : key.replace(/-|\s/gm, '_').toUpperCase());
        const r = this.translate.instant(t, interpolatedParams);
        return t === r ? key : r;
    }
}
