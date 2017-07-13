/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {ShowBrowserOnOfflineComponent} from './show-browseronoffline.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {AppServiceStub} from '../../testing/appservice-stubs';
import {GenericAppService} from '../../../search-commons/services/generic-app.service';

describe('ShowBrowserOnOfflineComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            declarations: [
                ShowBrowserOnOfflineComponent
            ],
            providers: [
                TranslateService,
                { provide: GenericAppService, useValue: new AppServiceStub() }

            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });
        TestBed.compileComponents();
    });

    it('create component', async(() => {
        const fixture = TestBed.createComponent(ShowBrowserOnOfflineComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
