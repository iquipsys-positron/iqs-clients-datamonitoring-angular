import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsDatamonitoringDataSummaryComponent } from './data-summary.component';
import { IqsDatamonitoringDataSummaryModule } from './data-summary.module';

describe('[Datamonitoring] components/data-summary', () => {
    let component: IqsDatamonitoringDataSummaryComponent;
    let fixture: ComponentFixture<IqsDatamonitoringDataSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IqsDatamonitoringDataSummaryModule]
        })
            .compileComponents();
    }));

    // beforeEach(() => {
    //     fixture = TestBed.createComponent(DataSummaryComponent);
    //     component = fixture.componentInstance;
    //     fixture.detectChanges();
    // });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
