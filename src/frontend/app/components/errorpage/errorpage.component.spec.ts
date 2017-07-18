/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {ErrorPageComponent} from './errorpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';

describe('ErrorPageComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            declarations: [
                ErrorPageComponent
            ],
            providers: [
                TranslateService,
                PageUtils
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });
        TestBed.compileComponents();
    });

    it('create component', async(() => {
        const fixture = TestBed.createComponent(ErrorPageComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
