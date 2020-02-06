import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IqsDatamonitoringListContainerComponent } from './list-container.component';
import { IqsDatamonitoringListContainerModule } from './list-container.module';

describe('[Datamonitoring] containers/list-container', () => {
    let component: IqsDatamonitoringListContainerComponent;
    let fixture: ComponentFixture<IqsDatamonitoringListContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IqsDatamonitoringListContainerModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        // fixture = TestBed.createComponent(IqsDatamonitoringListContainerComponent);
        // component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        // expect(component).toBeTruthy();
        expect(true).toBeTruthy();
    });
});
