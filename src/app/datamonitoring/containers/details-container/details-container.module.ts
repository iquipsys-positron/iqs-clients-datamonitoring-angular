import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatSidenavModule
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule, PipRefItemModule } from 'pip-webui2-controls';
import { PipMediaModule, PipScrollableModule } from 'pip-webui2-layouts';

import { IqsDatamonitoringDetailsContainerComponent } from './details-container.component';
import { IqsDatamonitoringComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [IqsDatamonitoringDetailsContainerComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        TranslateModule,
        // pip-webui2
        PipEmptyStateModule,
        PipMediaModule,
        PipRefItemModule,
        PipScrollableModule,
        // iqs-clients2
        IqsDatamonitoringComponentsModule,
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDatamonitoringDetailsContainerModule { }
