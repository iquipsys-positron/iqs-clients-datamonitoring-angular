import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'iqs-libs-clientshell2-angular';

import { IqsDatamonitoringDetailsContainerComponent } from './containers/details-container/details-container.component';
import { IqsDatamonitoringListContainerComponent } from './containers/list-container/list-container.component';

export const routes: Routes = [
    { path: '', component: IqsDatamonitoringListContainerComponent, canActivate: [AuthGuard] },
    { path: ':id', component: IqsDatamonitoringDetailsContainerComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IqsDatamonitoringRoutingModule { }
