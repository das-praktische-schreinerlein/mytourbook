import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SDocListComponent} from './components/sdoc-list/sdoc-list.component';
import {SDocListItemComponent} from './components/sdoc-list-item/sdoc-list-item.component';
import {SDocEditformComponent} from './components/sdoc-editform/sdoc-editform.component';
import {SDocSearchformComponent} from './components/sdoc-searchform/sdoc-searchform.component';
import {SDocInlineSearchpageComponent} from './components/sdoc-inline-searchpage/sdoc-inline-searchpage.component';
import {SDocListItemSmallComponent} from './components/sdoc-list-item-small/sdoc-list-item-small.component';
import {SDocListItemFlatComponent} from './components/sdoc-list-item-flat/sdoc-list-item-flat.component';
import {AngularMapsModule} from '../../shared/angular-maps/angular-maps.module';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng2-toastr';
import {LightboxModule} from 'angular2-lightbox';
import {SDocProfileMapComponent} from './components/sdoc-profilemap/sdoc-profilemap.component';
import {SDocMapComponent} from './components/sdoc-map/sdoc-map.component';
import {SDocLinkedLocHierarchyComponent} from './components/sdoc-linked-loc-hierarchy/sdoc-linked-loc-hierarchy.component';
import {SDocRateTechComponent} from './components/sdoc-ratetech/sdoc-ratetech.component';
import {SDocDataTechComponent} from './components/sdoc-datatech/sdoc-datatech.component';
import {SDocRatePersonalComponent} from './components/sdoc-ratepers/sdoc-ratepers.component';
import {SDocListItemPageComponent} from './components/sdoc-list-item-page/sdoc-list-item-page.component';
import {SDocRatePersonalDifficultyComponent} from './components/sdoc-ratepers-difficulty/sdoc-ratepers-difficulty.component';
import {SDocDataInfoComponent} from './components/sdoc-datainfo/sdoc-datainfo.component';
import {SDocDistanceComponent} from './components/sdoc-distance/sdoc-distance.component';
import {SDocListItemThinComponent} from './components/sdoc-list-item-thin/sdoc-list-item-thin.component';
import {SDocDateFormatPipe} from './pipes/sdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {SDocDataMetaComponent} from './components/sdoc-datameta/sdoc-datameta.component';
import {SDocActionsComponent} from './components/sdoc-actions/sdoc-actions.component';
import {SDocActionTagsComponent} from './components/sdoc-actiontags/sdoc-actiontags.component';
import {SDocPersonTagsComponent} from './components/sdoc-persontags/sdoc-persontags.component';
import {FileDropModule} from 'ngx-file-drop';
import {FrontendCdocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {SDocKeywordsComponent} from './components/sdoc-keywords/sdoc-keywords.component';
import {SDocKeywordsstateComponent} from './components/sdoc-keywordsstate/sdoc-keywordsstate.component';
import {SDocVideoplayerComponent} from './components/sdoc-videoplayer/sdoc-videoplayer.component';
import {SDocPersontagsstateComponent} from './components/sdoc-persontagsstate/sdoc-persontagsstate.component';

@NgModule({
    declarations: [
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListItemFlatComponent,
        SDocListItemThinComponent,
        SDocListItemPageComponent,
        SDocEditformComponent,
        SDocSearchformComponent,
        SDocInlineSearchpageComponent,
        SDocMapComponent,
        SDocProfileMapComponent,
        SDocInlineSearchpageComponent,
        SDocLinkedLocHierarchyComponent,
        SDocDataTechComponent,
        SDocRatePersonalComponent,
        SDocRatePersonalDifficultyComponent,
        SDocDataInfoComponent,
        SDocDataMetaComponent,
        SDocRateTechComponent,
        SDocDistanceComponent,
        SDocDateFormatPipe,
        SDocActionsComponent,
        SDocActionTagsComponent,
        SDocPersonTagsComponent,
        SDocKeywordsComponent,
        SDocKeywordsstateComponent,
        SDocVideoplayerComponent,
        SDocPersontagsstateComponent
    ],
    imports: [
        ToastModule,
        NgbModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AngularCommonsModule,
        AngularMapsModule,
        FrontendCdocCommonsModule,
        LightboxModule,
        FileDropModule
    ],
    providers: [
        DatePipe
    ],
    exports: [
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListItemFlatComponent,
        SDocListItemThinComponent,
        SDocListItemPageComponent,
        SDocEditformComponent,
        SDocSearchformComponent,
        SDocInlineSearchpageComponent,
        SDocMapComponent,
        SDocProfileMapComponent,
        SDocInlineSearchpageComponent,
        SDocLinkedLocHierarchyComponent,
        SDocDataTechComponent,
        SDocRatePersonalComponent,
        SDocRatePersonalDifficultyComponent,
        SDocDataInfoComponent,
        SDocDataMetaComponent,
        SDocRateTechComponent,
        SDocDistanceComponent,
        SDocDateFormatPipe,
        SDocActionsComponent,
        SDocActionTagsComponent,
        SDocPersonTagsComponent,
        SDocKeywordsComponent,
        SDocKeywordsstateComponent,
        SDocVideoplayerComponent,
        SDocPersontagsstateComponent
    ]
})
export class SharedSDocModule {}
