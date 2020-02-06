import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IqsDatamonitoringMapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule } from 'pip-webui2-controls';

@NgModule({
    declarations: [IqsDatamonitoringMapComponent],
    exports: [IqsDatamonitoringMapComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        TranslateModule,
        // pip-webui2
        PipEmptyStateModule
    ]
})
export class IqsDatamonitoringMapModule { }
