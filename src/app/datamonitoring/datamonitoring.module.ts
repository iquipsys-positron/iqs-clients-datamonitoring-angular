import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IqsDatamonitoringComponentsModule } from './components/components.module';
import { IqsDatamonitorinsContainersModule } from './containers/containers.module';
import { IqsDatamonitoringRoutingModule } from './datamonitoring-routing.module';
import { IqsDataprofilesModule } from '../dataprofiles';
import { IqsDeviceprofilesModule } from '../deviceprofiles';
import {
    IqsDatamonitoringService,
    IqsObjectDataDataService
} from './services';
import { datamonitoringReducer, IqsDatamonitoringEffects } from './store';

@NgModule({
    imports: [
        // Angular and vendors
        StoreModule.forFeature('datamonitoring', datamonitoringReducer),
        EffectsModule.forFeature([IqsDatamonitoringEffects]),
        // iqs-clients2
        IqsDatamonitoringComponentsModule,
        IqsDatamonitorinsContainersModule,
        IqsDatamonitoringRoutingModule,
        IqsDataprofilesModule,
        IqsDeviceprofilesModule
    ],
    providers: [
        IqsObjectDataDataService,
        IqsDatamonitoringService
    ]
})
export class IqsDatamonitoringModule { }
