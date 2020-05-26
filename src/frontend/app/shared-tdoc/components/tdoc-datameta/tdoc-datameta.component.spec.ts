/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TourDocDataMetaComponent} from './tdoc-datameta.component';

describe('TourDocDataMetaComponent', () => {
    let component: TourDocDataMetaComponent;
    let fixture: ComponentFixture<TourDocDataMetaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocDataMetaComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule,
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocDataMetaComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
