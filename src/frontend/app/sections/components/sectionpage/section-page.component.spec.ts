/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SectionPageComponent} from './section-page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {PDocDataServiceStub} from '../../../../testing/pdoc-dataservice-stubs';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ErrorResolver} from '../../resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';

class RouterStub {
    navigateByUrl(url: string) { return url; }
}

describe('SectionPageComponent', () => {
    let component: SectionPageComponent;
    let fixture: ComponentFixture<SectionPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SectionPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                SDocSearchFormConverter,
                SDocRoutingService,
                SearchParameterUtils,
                ToastsManager,
                TranslateService,
                ErrorResolver,
                PageUtils
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
