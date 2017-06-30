/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocEditpageComponent} from './sdoc-editpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore, SDocTeamFilterConfig} from '../../../../shared/sdoc-commons/services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';

describe('SDocEditpageComponent', () => {
    let component: SDocEditpageComponent;
    let fixture: ComponentFixture<SDocEditpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocEditpageComponent],
            imports: [
                ToastModule.forRoot()
            ],
            providers: [
                { provide: SDocDataStore, useValue: new SDocDataStore(new SearchParameterUtils(), new SDocTeamFilterConfig()) },
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
