/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {TourDocLinkedPlaylistsComponent} from './tdoc-linked-playlists.component';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocAlbumService} from '../../services/tdoc-album.service';
import {TourDocPlaylistService} from '../../services/tdoc-playlist.service';

describe('TourDocLinkedPlaylistsComponent', () => {
    let component: TourDocLinkedPlaylistsComponent;
    let fixture: ComponentFixture<TourDocLinkedPlaylistsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocLinkedPlaylistsComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                TourDocContentUtils,
                TourDocActionTagService,
                TourDocAlbumService,
                TourDocPlaylistService,
                NgbModal,
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule,
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocLinkedPlaylistsComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
