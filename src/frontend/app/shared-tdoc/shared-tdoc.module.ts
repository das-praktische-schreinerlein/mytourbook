import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TourDocListComponent} from './components/tdoc-list/tdoc-list.component';
import {TourDocListItemComponent} from './components/tdoc-list-item/tdoc-list-item.component';
import {TourDocSearchformComponent} from './components/tdoc-searchform/tdoc-searchform.component';
import {TourDocInlineSearchpageComponent} from './components/tdoc-inline-searchpage/tdoc-inline-searchpage.component';
import {TourDocListItemSmallComponent} from './components/tdoc-list-item-small/tdoc-list-item-small.component';
import {TourDocListItemFlatComponent} from './components/tdoc-list-item-flat/tdoc-list-item-flat.component';
import {AngularMapsModule} from '@dps/mycms-frontend-commons/dist/angular-maps/angular-maps.module';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbAccordionModule, NgbRatingModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {LightboxModule} from 'ngx-lightbox';
import {TourDocProfileMapComponent} from './components/tdoc-profilemap/tdoc-profilemap.component';
import {TourDocMapComponent} from './components/tdoc-map/tdoc-map.component';
import {TourDocLinkedLocHierarchyComponent} from './components/tdoc-linked-loc-hierarchy/tdoc-linked-loc-hierarchy.component';
import {TourDocRateTechComponent} from './components/tdoc-ratetech/tdoc-ratetech.component';
import {TourDocDataTechComponent} from './components/tdoc-datatech/tdoc-datatech.component';
import {TourDocRatePersonalComponent} from './components/tdoc-ratepers/tdoc-ratepers.component';
import {TourDocListItemPageComponent} from './components/tdoc-list-item-page/tdoc-list-item-page.component';
import {TourDocRatePersonalDifficultyComponent} from './components/tdoc-ratepers-difficulty/tdoc-ratepers-difficulty.component';
import {TourDocDataInfoComponent} from './components/tdoc-datainfo/tdoc-datainfo.component';
import {TourDocDistanceComponent} from './components/tdoc-distance/tdoc-distance.component';
import {TourDocListItemThinComponent} from './components/tdoc-list-item-thin/tdoc-list-item-thin.component';
import {TourDocDateFormatPipe} from './pipes/tdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {TourDocDataMetaComponent} from './components/tdoc-datameta/tdoc-datameta.component';
import {TourDocActionsComponent} from './components/tdoc-actions/tdoc-actions.component';
import {TourDocActionTagsComponent} from './components/tdoc-actiontags/tdoc-actiontags.component';
import {TourDocPersonTagsComponent} from './components/tdoc-persontags/tdoc-persontags.component';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocKeywordsComponent} from './components/tdoc-keywords/tdoc-keywords.component';
import {TourDocKeywordsstateComponent} from './components/tdoc-keywordsstate/tdoc-keywordsstate.component';
import {TourDocVideoplayerComponent} from './components/tdoc-videoplayer/tdoc-videoplayer.component';
import {TourDocPersontagsstateComponent} from './components/tdoc-persontagsstate/tdoc-persontagsstate.component';
import {TourDocMultiActionHeaderComponent} from './components/tdoc-multiactionheader/tdoc-multiactionheader.component';
import {TourDocMapCodePipe} from './pipes/tdoc-mapcode.pipe';
import {TourDocDashboardSearchColumnComponent} from './components/tdoc-dashboard-searchcolumn/tdoc-dashboard-searchcolumn.component';
import {TourDocKeywordTagFormComponent} from './components/tdoc-keywordtagform/tdoc-keywordtagform.component';
import {TourDocSimpleSearchNavigationComponent} from './components/tdoc-simple-search-navigation/tdoc-simple-search-navigation.component';
import {VisJsProfileChartComponent} from './components/visjs-profilechart/visjs-profilechart.component';
import {TourDocProfileChartComponent} from './components/tdoc-profilechart/tdoc-profilechart.component';
import {TourDocInfoComponent} from './components/tdoc-info/tdoc-info.component';
import {TourDocRouteAttributeComponent} from './components/tdoc-routeattr/tdoc-routeattr.component';
import {TourDocLinkedRoutesComponent} from './components/tdoc-linked-routes/tdoc-linked-routes.component';
import {RouterModule} from '@angular/router';
import {TourDocLinkedInfosComponent} from './components/tdoc-linked-infos/tdoc-linked-infos.component';
import {TourDocLinkedPlaylistsComponent} from './components/tdoc-linked-playlists/tdoc-linked-playlists.component';
import {TourDocLinkedPoisComponent} from './components/tdoc-linked-pois/tdoc-linked-pois.component';

@NgModule({
    declarations: [
        TourDocListComponent,
        TourDocListItemComponent,
        TourDocListItemSmallComponent,
        TourDocListItemFlatComponent,
        TourDocListItemThinComponent,
        TourDocListItemPageComponent,
        TourDocSearchformComponent,
        TourDocInlineSearchpageComponent,
        TourDocMapComponent,
        TourDocProfileMapComponent,
        TourDocInlineSearchpageComponent,
        TourDocLinkedLocHierarchyComponent,
        TourDocDataTechComponent,
        TourDocRatePersonalComponent,
        TourDocRatePersonalDifficultyComponent,
        TourDocDataInfoComponent,
        TourDocDataMetaComponent,
        TourDocRateTechComponent,
        TourDocDistanceComponent,
        TourDocDateFormatPipe,
        TourDocMapCodePipe,
        TourDocActionsComponent,
        TourDocActionTagsComponent,
        TourDocPersonTagsComponent,
        TourDocKeywordsComponent,
        TourDocKeywordsstateComponent,
        TourDocVideoplayerComponent,
        TourDocPersontagsstateComponent,
        TourDocMultiActionHeaderComponent,
        TourDocDashboardSearchColumnComponent,
        TourDocKeywordTagFormComponent,
        TourDocSimpleSearchNavigationComponent,
        VisJsProfileChartComponent,
        TourDocProfileChartComponent,
        TourDocInfoComponent,
        TourDocRouteAttributeComponent,
        TourDocLinkedRoutesComponent,
        TourDocLinkedInfosComponent,
        TourDocLinkedPlaylistsComponent,
        TourDocLinkedPoisComponent
    ],
    imports: [
        NgbAccordionModule, NgbRatingModule, NgbTabsetModule,
        ToastrModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularCommonsModule,
        AngularMapsModule,
        FrontendCommonDocCommonsModule,
        LightboxModule,
        RouterModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        TourDocListComponent,
        TourDocListItemComponent,
        TourDocListItemSmallComponent,
        TourDocListItemFlatComponent,
        TourDocListItemThinComponent,
        TourDocListItemPageComponent,
        TourDocSearchformComponent,
        TourDocInlineSearchpageComponent,
        TourDocMapComponent,
        TourDocProfileMapComponent,
        TourDocInlineSearchpageComponent,
        TourDocLinkedLocHierarchyComponent,
        TourDocDataTechComponent,
        TourDocRatePersonalComponent,
        TourDocRatePersonalDifficultyComponent,
        TourDocDataInfoComponent,
        TourDocDataMetaComponent,
        TourDocRateTechComponent,
        TourDocDistanceComponent,
        TourDocDateFormatPipe,
        TourDocMapCodePipe,
        TourDocActionsComponent,
        TourDocActionTagsComponent,
        TourDocPersonTagsComponent,
        TourDocKeywordsComponent,
        TourDocKeywordsstateComponent,
        TourDocVideoplayerComponent,
        TourDocPersontagsstateComponent,
        TourDocMultiActionHeaderComponent,
        TourDocDashboardSearchColumnComponent,
        TourDocKeywordTagFormComponent,
        TourDocSimpleSearchNavigationComponent,
        VisJsProfileChartComponent,
        TourDocProfileChartComponent,
        TourDocInfoComponent,
        TourDocRouteAttributeComponent,
        TourDocLinkedRoutesComponent,
        TourDocLinkedInfosComponent,
        TourDocLinkedPlaylistsComponent,
        TourDocLinkedPoisComponent
    ]
})
export class SharedTourDocModule {}
