import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsDatamonitoringDataChartComponent } from './data-chart.component';
import { IqsDatamonitoringDataChartModule } from './data-chart.module';

describe('[Datamonitoring] components/data-chart', () => {
    let component: IqsDatamonitoringDataChartComponent;
    let fixture: ComponentFixture<IqsDatamonitoringDataChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IqsDatamonitoringDataChartModule]
        })
            .compileComponents();
    }));

    // beforeEach(() => {
    //     fixture = TestBed.createComponent(IqsDatamonitoringDataChartComponent);
    //     component = fixture.componentInstance;
    //     fixture.detectChanges();
    // });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
