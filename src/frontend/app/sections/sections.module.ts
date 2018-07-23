import {NgModule} from '@angular/core';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsSDocRecordResolver} from './resolver/sections-sdoc-details.resolver';
import {SectionsRoutingModule} from './sections-routing.module';
import {SectionsBaseUrlResolver} from '../../shared/frontend-commons/resolver/sections-baseurl.resolver';
import {SectionBarComponent} from './components/sectionbar/sectionbar.component';
import {SectionsPDocRecordResolver} from '../../shared/frontend-commons/resolver/sections-pdoc-details.resolver';
import {SectionComponent} from './components/section/section.component';
import {SectionPageComponent} from './components/sectionpage/section-page.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';
import {SharedPDocModule} from '../shared-pdoc/shared-pdoc.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SectionsPDocsResolver} from '../../shared/frontend-commons/resolver/sections-pdocs.resolver';
import {ErrorResolver} from '../../shared/frontend-commons/resolver/error.resolver';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {MarkdownModule} from 'angular2-markdown';
import {AngularMarkdownService} from '../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../shared/angular-commons/services/common-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {FrontendCommonsModule} from '../../shared/frontend-commons/frontend-commons.module';

@NgModule({
    declarations: [
        SectionComponent,
        SectionPageComponent,
        SectionBarComponent
    ],
    imports: [
        TranslateModule,
        NgbModule.forRoot(),
        MarkdownModule.forRoot(),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SharedSDocModule,
        SharedPDocModule,
        SectionsRoutingModule,
        FrontendCommonsModule
    ],
    providers: [
        CommonRoutingService,
        SectionsBaseUrlResolver,
        SectionsSearchFormResolver,
        SectionsSDocRecordResolver,
        SectionsPDocRecordResolver,
        SectionsPDocsResolver,
        ErrorResolver,
        AngularHtmlService,
        AngularMarkdownService,
        PageUtils
    ]
})
export class SectionsModule {}
