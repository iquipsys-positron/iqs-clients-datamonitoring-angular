import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IqsDataprofilesDataService, IqsDataprofilesService, IqsDataprofilesTranslateService } from './services';
import { dataprofilesReducer, IqsDataprofilesEffects } from './store';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('dataprofiles', dataprofilesReducer),
        EffectsModule.forFeature([IqsDataprofilesEffects]),
    ],
    providers: [
        IqsDataprofilesDataService,
        IqsDataprofilesService,
        IqsDataprofilesTranslateService
    ]
})
export class IqsDataprofilesModule { }
