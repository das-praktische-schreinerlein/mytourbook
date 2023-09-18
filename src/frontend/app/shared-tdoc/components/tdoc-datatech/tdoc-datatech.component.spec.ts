/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataTechComponent} from './tdoc-datatech.component';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TourDocDateFormatPipe} from '../../pipes/tdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';

describe('TourDocDataTechComponent', () => {
    let component: TourDocDataTechComponent;
    let fixture: ComponentFixture<TourDocDataTechComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocDataTechComponent, TourDocDateFormatPipe],
            providers: [
                DatePipe,
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocDataTechComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
