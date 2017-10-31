/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataTechComponent} from './sdoc-datatech.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {DomSanitizer} from '@angular/platform-browser';

describe('SDocDataTechComponent', () => {
    let component: SDocDataTechComponent;
    let fixture: ComponentFixture<SDocDataTechComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocDataTechComponent],
            providers: [DomSanitizer],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocDataTechComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
