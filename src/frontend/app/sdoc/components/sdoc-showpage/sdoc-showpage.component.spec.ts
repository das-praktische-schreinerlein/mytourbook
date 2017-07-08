/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocShowpageComponent} from './sdoc-showpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';

describe('SDocShowpageComponent', () => {
    let component: SDocShowpageComponent;
    let fixture: ComponentFixture<SDocShowpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocShowpageComponent],
            imports: [
                NgbModule.forRoot(),
                ToastModule.forRoot(),
                TranslateModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useClass: RouterTestingModule },
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                SDocRoutingService,
                ToastsManager,
                TranslateService,
                ErrorResolver
        ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocShowpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
