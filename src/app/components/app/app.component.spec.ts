/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../sdocshared/services/sdoc-data.service';
import {Router} from '@angular/router';
import {SDocDataStore} from '../../sdocbackend/services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppServiceStub} from '../../../testing/appservice-stubs';
import {ToastsManagerStub} from '../../../testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../commons/services/generic-app.service';

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                NoopAnimationsModule,
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                {provide: Router, useClass: RouterTestingModule},
                SDocDataStore,
                SDocDataService,
                TranslateService,
                {provide: GenericAppService, useValue: new AppServiceStub() },
                {provide: ToastsManager, useValue: new ToastsManagerStub() }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
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
