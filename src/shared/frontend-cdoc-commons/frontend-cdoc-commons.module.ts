import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonDocListHeaderComponent} from './components/cdoc-list-header/cdoc-list-header.component';
import {CommonDocListFooterComponent} from './components/cdoc-list-footer/cdoc-list-footer.component';
import {CommonDocKeywordsStateComponent} from './components/cdoc-keywordsstate/cdoc-keywordsstate.component';
import {CommonDocKeywordsComponent} from './components/cdoc-keywords/cdoc-keywords.component';
import {CommonDocTimetableComponent} from './components/cdoc-timetable/cdoc-timetable.component';
import {CommonDocTagcloudComponent} from './components/cdoc-tagcloud/cdoc-tagcloud.component';
import {CommonDocTypetableComponent} from './components/cdoc-typetable/cdoc-typetable.component';
import {CommonDocTagsStateComponent} from './components/cdoc-tagsstate/cdoc-tagsstate.component';
import {CommonDocTagsComponent} from './components/cdoc-tags/cdoc-tags.component';
import {CommonDocVideoplayerComponent} from './components/cdoc-videoplayer/cdoc-videoplayer.component';
import {CommonDocListItemComponent} from './components/cdoc-list-item/cdoc-list-item.component';
import {AngularCommonsModule} from '../angular-commons/angular-commons.module';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonDocListComponent} from './components/cdoc-list/cdoc-list.component';
import {CommonDocAudioplayerComponent} from './components/cdoc-audioplayer/cdoc-audioplayer.component';
import {CommonDocActionTagsComponent} from './components/cdoc-actiontags/cdoc-actiontags.component';

@NgModule({
    declarations: [
        CommonDocListComponent,
        CommonDocListHeaderComponent,
        CommonDocListFooterComponent,
        CommonDocListItemComponent,
        CommonDocKeywordsComponent,
        CommonDocKeywordsStateComponent,
        CommonDocTimetableComponent,
        CommonDocTypetableComponent,
        CommonDocTagcloudComponent,
        CommonDocTagsComponent,
        CommonDocTagsStateComponent,
        CommonDocVideoplayerComponent,
        CommonDocAudioplayerComponent,
        CommonDocActionTagsComponent
    ],
    imports: [
        NgbModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AngularCommonsModule
    ],
    exports: [
        CommonDocListComponent,
        CommonDocListHeaderComponent,
        CommonDocListFooterComponent,
        CommonDocListItemComponent,
        CommonDocKeywordsComponent,
        CommonDocKeywordsStateComponent,
        CommonDocTimetableComponent,
        CommonDocTypetableComponent,
        CommonDocTagcloudComponent,
        CommonDocTagsComponent,
        CommonDocTagsStateComponent,
        CommonDocVideoplayerComponent,
        CommonDocAudioplayerComponent,
        CommonDocActionTagsComponent
    ]
})
export class FrontendCdocCommonsModule {
}
