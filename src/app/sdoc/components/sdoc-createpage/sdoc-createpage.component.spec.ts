/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocCreatepageComponent} from './sdoc-createpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../sdocshared/services/sdoc-data.service';
import {Router} from '@angular/router';
import {SDocDataStore} from '../../../sdocbackend/services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

describe('SDocCreatepageComponent', () => {
    let component: SDocCreatepageComponent;
    let fixture: ComponentFixture<SDocCreatepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [SDocCreatepageComponent],
            providers: [SDocDataStore,
                SDocDataService,
                SearchFormUtils,
                TranslateService,
                {provide: Router, useClass: RouterTestingModule}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocCreatepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
