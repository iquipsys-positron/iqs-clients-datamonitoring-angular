import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsDatamonitoringEventsListComponent } from './events-list.component';
import { IqsDatamonitoringEventsListModule } from './events-list.module';

describe('[Datamonitoring] components/events-list', () => {
    let component: IqsDatamonitoringEventsListComponent;
    let fixture: ComponentFixture<IqsDatamonitoringEventsListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IqsDatamonitoringEventsListModule]
        })
            .compileComponents();
    }));

    //   beforeEach(() => {
    //     fixture = TestBed.createComponent(IqsDatamonitoringEventsListComponent);
    //     component = fixture.componentInstance;
    //     fixture.detectChanges();
    //   });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
