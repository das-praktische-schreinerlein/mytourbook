/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {TourDocObjectDetectionObjectKeyEditFormComponent} from './tdoc-odobjectkeyeditform.component';
import {TourDocDateFormatPipe} from '../../pipes/tdoc-dateformat.pipe';
import {FormBuilder} from '@angular/forms';
import {TourDocDataStore, TourDocTeamFilterConfig} from '../../../../../shared/tdoc-commons/services/tdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {DatePipe} from '@angular/common';

describe('TourDocObjectDetectionObjectKeyEditFormComponent', () => {
    let component: TourDocObjectDetectionObjectKeyEditFormComponent;
    let fixture: ComponentFixture<TourDocObjectDetectionObjectKeyEditFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocObjectDetectionObjectKeyEditFormComponent, TourDocDateFormatPipe],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule,
                TranslateModule.forRoot()],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: TourDocDataStore, useValue: new TourDocDataStore(new SearchParameterUtils(), new TourDocTeamFilterConfig()) },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                DatePipe,
                FormBuilder,
                NgbModal,
                NgbActiveModal,
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                TourDocContentUtils,
                SearchFormUtils,
                TourDocSearchFormUtils,
                { provide: ToastrService, useValue: new ToastrServiceStub() }

            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocObjectDetectionObjectKeyEditFormComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
