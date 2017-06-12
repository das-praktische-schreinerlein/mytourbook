/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchpageComponent} from './sdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore} from '../../../services/sdoc-data.store';
import {Observable} from 'rxjs/Observable';
import {AppService} from '../../../services/app.service';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {SDocSearchFormConverter} from '../../../services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';

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
            imports: [ToastModule.forRoot()],
            providers: [SDocDataStore,
                {provide: AppService, useValue: new AppServiceStub() },
                SDocDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 1})
                    }
                },
                {provide: Router, useValue: new RouterStub() },
                SDocSearchFormConverter,
                ToastsManager
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
