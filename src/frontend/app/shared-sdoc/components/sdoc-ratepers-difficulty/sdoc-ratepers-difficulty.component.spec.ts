/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocRatePersonalDifficultyComponent} from './sdoc-ratepers-difficulty.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

describe('SDocRatePersonalDifficultyComponent', () => {
    let component: SDocRatePersonalDifficultyComponent;
    let fixture: ComponentFixture<SDocRatePersonalDifficultyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocRatePersonalDifficultyComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocRatePersonalDifficultyComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
