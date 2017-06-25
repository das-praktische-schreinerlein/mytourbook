/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchpageComponent} from './sdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../sdocshared/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore} from '../../../sdocbackend/services/sdoc-data.store';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../../commons/services/generic-app.service';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

class RouterStub {
    public routerState: {} = {
        snapshot: {
            url: 'record'
        }
    };
    navigateByUrl(url: string) { return url; }
}

describe('SDocSearchpageComponent', () => {
    let component: SDocSearchpageComponent;
    let fixture: ComponentFixture<SDocSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocSearchpageComponent],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                SDocSearchFormConverter,
                SearchFormUtils,
                SDocRoutingService,
                ToastsManager,
                TranslateService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
