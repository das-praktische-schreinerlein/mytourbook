/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocShowpageComponent} from './sdoc-showpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../sdocshared/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {SDocDataStore} from '../../../sdocbackend/services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../../commons/services/generic-app.service';

describe('SDocShowpageComponent', () => {
    let component: SDocShowpageComponent;
    let fixture: ComponentFixture<SDocShowpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocShowpageComponent],
            imports: [ToastModule.forRoot(), TranslateModule.forRoot()],
            providers: [SDocDataStore,
                {provide: GenericAppService, useValue: new AppServiceStub() },
                SDocDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 123}),
                        data: Observable.of({record: new SDocRecord({id: '1', name: 'Test'})}),
                        snapshot: {
                            queryParamMap: new Map()
                        }
                    }
                },
                {provide: Router, useClass: RouterTestingModule},
                SDocRoutingService,
                SDocSearchFormConverter, SearchFormUtils,
                ToastsManager, TranslateService

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
