import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CDocListHeaderComponent} from './components/cdoc-list-header/cdoc-list-header.component';
import {CDocListFooterComponent} from './components/cdoc-list-footer/cdoc-list-footer.component';
import {CDocKeywordsStateComponent} from './components/cdoc-keywordsstate/cdoc-keywordsstate.component';
import {CDocKeywordsComponent} from './components/cdoc-keywords/cdoc-keywords.component';
import {CDocTimetableComponent} from './components/cdoc-timetable/cdoc-timetable.component';
import {CDocTagcloudComponent} from './components/cdoc-tagcloud/cdoc-tagcloud.component';
import {CDocTypetableComponent} from './components/cdoc-typetable/cdoc-typetable.component';
import {CDocTagsStateComponent} from './components/cdoc-tagsstate/cdoc-tagsstate.component';
import {CDocTagsComponent} from './components/cdoc-tags/cdoc-tags.component';
import {CDocVideoplayerComponent} from './components/cdoc-videoplayer/cdoc-videoplayer.component';
import {CDocListItemComponent} from './components/cdoc-list-item/cdoc-list-item.component';
import {AngularCommonsModule} from '../angular-commons/angular-commons.module';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CDocListComponent} from './components/cdoc-list/cdoc-list.component';
import {CDocAudioplayerComponent} from './components/cdoc-audioplayer/cdoc-audioplayer.component';

@NgModule({
    declarations: [
        CDocListComponent,
        CDocListHeaderComponent,
        CDocListFooterComponent,
        CDocListItemComponent,
        CDocKeywordsComponent,
        CDocKeywordsStateComponent,
        CDocTimetableComponent,
        CDocTypetableComponent,
        CDocTagcloudComponent,
        CDocTagsComponent,
        CDocTagsStateComponent,
        CDocVideoplayerComponent,
        CDocAudioplayerComponent
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
        CDocListComponent,
        CDocListHeaderComponent,
        CDocListFooterComponent,
        CDocListItemComponent,
        CDocKeywordsComponent,
        CDocKeywordsStateComponent,
        CDocTimetableComponent,
        CDocTypetableComponent,
        CDocTagcloudComponent,
        CDocTagsComponent,
        CDocTagsStateComponent,
        CDocVideoplayerComponent,
        CDocAudioplayerComponent
    ]
})
export class FrontendCdocCommonsModule {
}
