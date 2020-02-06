import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PipEmptyStateModule, PipSearchInputModule, PipRefItemModule } from 'pip-webui2-controls';
import { PipShadowModule, PipDocumentLayoutModule, PipTilesLayoutModule, PipMediaModule } from 'pip-webui2-layouts';

import { IqsDatamonitoringListContainerComponent } from './list-container.component';

@NgModule({
    declarations: [IqsDatamonitoringListContainerComponent],
    imports: [
        // Angular and vendors
        CommonModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatProgressBarModule,
        MatToolbarModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        // pip-webui2
        PipDocumentLayoutModule,
        PipEmptyStateModule,
        PipMediaModule,
        PipRefItemModule,
        PipSearchInputModule,
        PipShadowModule,
        PipTilesLayoutModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IqsDatamonitoringListContainerModule { }
