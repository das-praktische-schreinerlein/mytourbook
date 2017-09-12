/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {SwitchOnOfflineComponent} from './switch-onoffline.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {FormBuilder} from '@angular/forms';
import {AppServiceStub} from '../../testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';

describe('SwitchOnOfflineComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            declarations: [
                SwitchOnOfflineComponent
            ],
            providers: [
                TranslateService,
                FormBuilder,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });
        TestBed.compileComponents();
    });

    it('create component', async(() => {
        const fixture = TestBed.createComponent(SwitchOnOfflineComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
