/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TourDocManagePlaylistEntriesComponent} from './tdoc-manage-playlist-entries.component';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {TourDocPlaylistService} from '../../../shared-tdoc/services/tdoc-playlist.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocAlbumService} from '../../../shared-tdoc/services/tdoc-album.service';

describe('TourDocManagePlaylistEntriesComponent', () => {
    let component: TourDocManagePlaylistEntriesComponent;
    let fixture: ComponentFixture<TourDocManagePlaylistEntriesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocManagePlaylistEntriesComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                TourDocRoutingService,
                TourDocContentUtils,
                TourDocActionTagService,
                TourDocPlaylistService,
                CommonDocRoutingService,
                TourDocAlbumService,
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocManagePlaylistEntriesComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
