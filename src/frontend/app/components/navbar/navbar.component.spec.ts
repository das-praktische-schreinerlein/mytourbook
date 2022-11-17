/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/pdoc-dataservice-stubs';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';

describe('NavbarComponent', () => {
    let component: NavbarComponent;
    let fixture: ComponentFixture<NavbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [NavbarComponent],
            schemas: [NO_ERRORS_SCHEMA],

            providers: [
                TranslateService,
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
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
