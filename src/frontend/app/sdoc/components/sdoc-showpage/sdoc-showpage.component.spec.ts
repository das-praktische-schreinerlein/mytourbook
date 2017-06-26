/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocShowpageComponent} from './sdoc-showpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';

describe('SDocShowpageComponent', () => {
    let component: SDocShowpageComponent;
    let fixture: ComponentFixture<SDocShowpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocShowpageComponent],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()],
            providers: [
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                ToastsManager,
                TranslateService

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
