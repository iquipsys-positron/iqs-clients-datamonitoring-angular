import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IqsDeviceprofilesDataService, IqsDeviceprofilesService } from './services';
import { deviceprofilesReducer, IqsDeviceprofilesEffects } from './store';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('deviceprofiles', deviceprofilesReducer),
        EffectsModule.forFeature([IqsDeviceprofilesEffects])
    ],
    providers: [
        IqsDeviceprofilesDataService,
        IqsDeviceprofilesService
    ]
})
export class IqsDeviceprofilesModule { }
