/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../../shared/angular-commons/testing/angulartics2-stubs';
import {SDocAlbumpageComponent} from './sdoc-albumpage.component';
import {SDocAlbumService} from '../../../shared-sdoc/services/sdoc-album.service';
import {FormBuilder} from '@angular/forms';

describe('SDocAlbumpageComponent', () => {
    let component: SDocAlbumpageComponent;
    let fixture: ComponentFixture<SDocAlbumpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocAlbumpageComponent],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                SDocRoutingService,
                ToastsManager,
                TranslateService,
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                SDocAlbumService,
                FormBuilder,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocAlbumpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
