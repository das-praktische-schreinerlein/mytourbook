/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentFactoryResolver, NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TourDocActionsComponent} from './tdoc-actions.component';
import {TourDocDynamicComponentService} from '../../services/tdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocAlbumService} from '../../services/tdoc-album.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {TourDocPlaylistService} from '../../services/tdoc-playlist.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocActionsComponent', () => {
    let component: TourDocActionsComponent;
    let fixture: ComponentFixture<TourDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocActionsComponent],
            imports: [
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                NgbModal,
                TourDocDynamicComponentService,
                DynamicComponentService,
                TourDocAlbumService,
                ComponentFactoryResolver,
                TourDocActionTagService,
                TourDocPlaylistService,
                TourDocContentUtils,
                CommonDocRoutingService,
                CommonRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocActionsComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
