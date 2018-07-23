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
import {CDocPersonTagsStateComponent} from './components/cdoc-persontagsstate/cdoc-persontagsstate.component';
import {AngularCommonsModule} from '../angular-commons/angular-commons.module';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        CDocListHeaderComponent,
        CDocListFooterComponent,
        CDocKeywordsComponent,
        CDocKeywordsStateComponent,
        CDocTimetableComponent,
        CDocTypetableComponent,
        CDocTagcloudComponent,
        CDocTagsComponent,
        CDocTagsStateComponent,
        CDocPersonTagsStateComponent,
        CDocVideoplayerComponent
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
        CDocListHeaderComponent,
        CDocListFooterComponent,
        CDocKeywordsComponent,
        CDocKeywordsStateComponent,
        CDocTimetableComponent,
        CDocTypetableComponent,
        CDocTagcloudComponent,
        CDocTagsComponent,
        CDocTagsStateComponent,
        CDocPersonTagsStateComponent,
        CDocVideoplayerComponent
    ]
})
export class FrontendCdocCommonsModule {
}
