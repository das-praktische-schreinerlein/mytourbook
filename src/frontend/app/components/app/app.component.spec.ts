/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppServiceStub} from '../../../testing/appservice-stubs';
import {ToastsManagerStub} from '../../../testing/toasts-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '../../../shared/search-commons/services/generic-app.service';
import {Router} from '@angular/router';

class RouterStub {
    navigateByUrl(url: string) { return url; }
}
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
                TranslateService,
                {provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: Router, useValue: new RouterStub() },
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
