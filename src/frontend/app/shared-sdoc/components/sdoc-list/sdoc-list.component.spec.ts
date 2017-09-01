/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListComponent} from './sdoc-list.component';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import { Lightbox, LightboxConfig, LightboxEvent } from 'angular2-lightbox';
import {SDocLightBox} from '../../services/sdoc-lightbox.service';

describe('SDocListComponent', () => {
    let component: SDocListComponent;
    let fixture: ComponentFixture<SDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                SDocSearchFormConverter,
                SDocContentUtils,
                SDocLightBox,
                Lightbox,
                LightboxConfig,
                LightboxEvent,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
