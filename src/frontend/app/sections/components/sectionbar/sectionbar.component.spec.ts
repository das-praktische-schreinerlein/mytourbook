/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SectionBarComponent} from './sectionbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {PDocDataServiceStub} from '../../../../testing/pdoc-dataservice-stubs';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';

class RouterStub {
    navigateByUrl(url: string) { return url; }
}
describe('SectionBarComponent', () => {
    let component: SectionBarComponent;
    let fixture: ComponentFixture<SectionBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SectionBarComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                FormBuilder,
                SDocSearchFormConverter,
                SDocRoutingService,
                SearchParameterUtils,
                ToastsManager,
                TranslateService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
