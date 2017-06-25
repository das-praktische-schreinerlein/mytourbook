/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocInlineSearchpageComponent} from './sdoc-inline-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../sdocshared/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore} from '../../../sdocbackend/services/sdoc-data.store';
import {Observable} from 'rxjs/Observable';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {SDocSearchFormConverter} from '../../../sdoc/services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../sdoc/services/sdoc-routing.service';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../../commons/services/generic-app.service';

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
            providers: [SDocDataStore,
                {provide: GenericAppService, useValue: new AppServiceStub() },
                SDocDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 1})
                    }
                },
                {provide: Router, useValue: new RouterStub() },
                SDocSearchFormConverter,
                SearchFormUtils,
                TranslateService,
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
