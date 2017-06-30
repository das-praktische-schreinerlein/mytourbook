/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocInlineSearchpageComponent} from './sdoc-inline-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore, SDocTeamFilterConfig} from '../../../../shared/sdoc-commons/services/sdoc-data.store';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {SDocSearchFormConverter} from '../../../sdoc/services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../sdoc/services/sdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';

class RouterStub {
    public routerState: {} = {
        snapshot: {
            url: 'record'
        }
    };
    navigateByUrl(url: string) { return url; }
}

describe('SDocInlineSearchpageComponent', () => {
    let component: SDocInlineSearchpageComponent;
    let fixture: ComponentFixture<SDocInlineSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocInlineSearchpageComponent],
            imports: [ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataStore, useValue: new SDocDataStore(new SearchParameterUtils(), new SDocTeamFilterConfig()) },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                SDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                SDocRoutingService,
                ToastsManager
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocInlineSearchpageComponent);
        component = fixture.componentInstance;
        component.params = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
