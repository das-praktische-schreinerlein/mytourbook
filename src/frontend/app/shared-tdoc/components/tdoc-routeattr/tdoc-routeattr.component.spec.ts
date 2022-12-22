/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TourDocRouteAttributeComponent} from './tdoc-routeattr.component';

describe('TourDocRouteAttributeComponent', () => {
    let component: TourDocRouteAttributeComponent;
    let fixture: ComponentFixture<TourDocRouteAttributeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocRouteAttributeComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocRouteAttributeComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
