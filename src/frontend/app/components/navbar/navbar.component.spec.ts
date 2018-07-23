/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../../shared/testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ToastsManagerStub} from '../../../shared/testing/toasts-stubs';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceStub} from '../../../shared/testing/pdoc-dataservice-stubs';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {AppServiceStub} from '../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            declarations: [NavbarComponent],
            schemas: [NO_ERRORS_SCHEMA],

            providers: [
                TranslateService,
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                {provide: ToastsManager, useValue: new ToastsManagerStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                {provide: GenericAppService, useValue: new AppServiceStub() },
                PageUtils
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
