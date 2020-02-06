import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxEchartsModule } from 'ngx-echarts';

import { IqsDatamonitoringDataChartComponent } from './data-chart.component';

@NgModule({
    declarations: [IqsDatamonitoringDataChartComponent],
    exports: [IqsDatamonitoringDataChartComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        NgxEchartsModule
    ]
})
export class IqsDatamonitoringDataChartModule { }
