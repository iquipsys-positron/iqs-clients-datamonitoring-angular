import { NgModule } from '@angular/core';

import { IqsDatamonitoringDataSummaryModule } from './data-summary/data-summary.module';
import { IqsDatamonitoringDataChartModule } from './data-chart/data-chart.module';
import { IqsDatamonitoringEventsListModule } from './events-list/events-list.module';
import { IqsDatamonitoringMapModule } from './map/map.module';

const COMPONENTS = [
    IqsDatamonitoringDataSummaryModule,
    IqsDatamonitoringDataChartModule,
    IqsDatamonitoringEventsListModule,
    IqsDatamonitoringMapModule
];

@NgModule({
    imports: COMPONENTS,
    exports: COMPONENTS
})
export class IqsDatamonitoringComponentsModule { }
