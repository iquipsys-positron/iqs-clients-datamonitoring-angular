import { NgModule } from '@angular/core';

import { IqsDatamonitoringDetailsContainerModule } from './details-container/details-container.module';
import { IqsDatamonitoringListContainerModule } from './list-container/list-container.module';

const CONTAINERS = [IqsDatamonitoringDetailsContainerModule, IqsDatamonitoringListContainerModule];

@NgModule({
    imports: CONTAINERS
})
export class IqsDatamonitorinsContainersModule { }
