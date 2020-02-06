import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'ngx-moment';
import { PipEmptyStateModule } from 'pip-webui2-controls';

import { IqsDatamonitoringEventsListComponent } from './events-list.component';

@NgModule({
    declarations: [IqsDatamonitoringEventsListComponent],
    exports: [IqsDatamonitoringEventsListComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MomentModule,
        TranslateModule,
        // pip-webui2
        PipEmptyStateModule
    ]
})
export class IqsDatamonitoringEventsListModule { }
