/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TourDocEditformComponent} from './tdoc-editform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {TourDocSearchFormUtils} from '../../../shared-tdoc/services/tdoc-searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {TourDocNameSuggesterService} from '../../services/tdoc-name-suggester.service';
import {TourDocDescSuggesterService} from '../../services/tdoc-desc-suggester.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {NgxMdModule} from 'ngx-md';
import {TourDocTripDescSuggesterService} from '../../services/tdoc-trip-desc-suggester.service';
import {TourDocLocationDescSuggesterService} from '../../services/tdoc-location-desc-suggester.service';
import {TourDocNewsDescSuggesterService} from '../../services/tdoc-news-desc-suggester.service';
import {TourDocRouteDescSuggesterService} from '../../services/tdoc-route-desc-suggester.service';
import {TourDocTrackDescSuggesterService} from '../../services/tdoc-track-desc-suggester.service';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {TourDocPlaylistService} from '../../../shared-tdoc/services/tdoc-playlist.service';
import {TourDocAlbumService} from '../../../shared-tdoc/services/tdoc-album.service';
import {GeoParserDeterminer} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo-parser.determiner';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GeoJsonParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geojson.parser';
import {GeoTxtParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geotxt.parser';
import {GeoGpxUtils} from '@dps/mycms-commons/dist/geo-commons/services/geogpx.utils';

describe('TourDocEditformComponent', () => {
    let component: TourDocEditformComponent;
    let fixture: ComponentFixture<TourDocEditformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocEditformComponent],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot(),
                NgxMdModule.forRoot()
            ],
            providers: [
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                TourDocSearchFormUtils,
                { provide: Router, useValue: new RouterStub() },
                GeoParserDeterminer,
                { provide: GeoGpxParser, useValue: new GeoGpxParser() },
                GeoJsonParser,
                GeoTxtParser,
                GeoGpxUtils,
                CommonRoutingService,
                CommonDocRoutingService,
                SearchFormUtils,
                SearchParameterUtils,
                CommonDocContentUtils,
                TourDocContentUtils,
                TourDocNameSuggesterService,
                TourDocDescSuggesterService,
                TourDocNewsDescSuggesterService,
                TourDocLocationDescSuggesterService,
                TourDocRouteDescSuggesterService,
                TourDocTrackDescSuggesterService,
                TourDocTripDescSuggesterService,
                PlatformService,
                AngularMarkdownService,
                AngularHtmlService,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                TourDocActionTagService,
                TourDocPlaylistService,
                TourDocAlbumService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocEditformComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
