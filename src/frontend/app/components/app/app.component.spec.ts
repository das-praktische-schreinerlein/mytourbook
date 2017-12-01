/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppServiceStub} from '../../../shared/angular-commons/testing/appservice-stubs';
import {ToastsManagerStub} from '../../../testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {CommonRoutingService} from '../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../shared/angular-commons/testing/router-stubs';
import {PlatformService} from '../../../shared/angular-commons/services/platform.service';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NoopAnimationsModule,
                ToastModule.forRoot(),
                TranslateModule.forRoot(),
                HttpModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                TranslateService,
                {provide: GenericAppService, useValue: new AppServiceStub() },
                CommonRoutingService,
                { provide: Router, useValue: new RouterStub() },
                {provide: ToastsManager, useValue: new ToastsManagerStub() },
                { provide: XHRBackend, useClass: MockBackend },
                PlatformService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'MyTourBook'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('MyTourBook');
    }));
});
