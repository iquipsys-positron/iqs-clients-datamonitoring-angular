import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IqsDatamonitoringDataSummaryComponent } from './data-summary.component';

@NgModule({
    declarations: [IqsDatamonitoringDataSummaryComponent],
    exports: [IqsDatamonitoringDataSummaryComponent],
    imports: [
        CommonModule
    ]
})
export class IqsDatamonitoringDataSummaryModule { }
