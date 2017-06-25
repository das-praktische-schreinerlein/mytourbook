/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocEditpageComponent} from './sdoc-editpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../sdocshared/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore} from '../../../sdocbackend/services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../sdoc/services/sdoc-routing.service';
import {SDocSearchFormConverter} from '../../../sdoc/services/sdoc-searchform-converter.service';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../../commons/services/generic-app.service';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';

describe('SDocEditpageComponent', () => {
    let component: SDocEditpageComponent;
    let fixture: ComponentFixture<SDocEditpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocEditpageComponent],
            imports: [
                ToastModule.forRoot()
            ],
            providers: [SDocDataStore,
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                ToastsManager

        ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocEditpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
