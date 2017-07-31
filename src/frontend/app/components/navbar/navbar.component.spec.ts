/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NavbarComponent} from './navbar.component';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../../testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ToastsManagerStub} from '../../../testing/toasts-stubs';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceStub} from '../../../testing/pdoc-dataservice-stubs';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';

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
