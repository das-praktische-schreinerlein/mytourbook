import {NgModule} from '@angular/core';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsSDocRecordResolver} from './resolver/sections-sdoc-details.resolver';
import {SectionsRoutingModule} from './sections-routing.module';
import {SectionsBaseUrlResolver} from '../../shared/frontend-cdoc-commons/resolver/sections-baseurl.resolver';
import {SectionsPDocRecordResolver} from '../../shared/frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {SectionPageComponent} from './components/sectionpage/section-page.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SectionsPDocsResolver} from '../../shared/frontend-cdoc-commons/resolver/sections-pdocs.resolver';
import {ErrorResolver} from '../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';
import {MarkdownModule} from 'angular2-markdown';
import {AngularMarkdownService} from '../../shared/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../shared/angular-commons/services/common-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {FrontendCdocCommonsModule} from '../../shared/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {FrontendPDocCommonsModule} from '../../shared/frontend-pdoc-commons/frontend-pdoc-commons.module';

@NgModule({
    declarations: [
        SectionPageComponent
    ],
    imports: [
        TranslateModule,
        NgbModule.forRoot(),
        MarkdownModule.forRoot(),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SharedSDocModule,
        FrontendPDocCommonsModule,
        SectionsRoutingModule,
        FrontendCdocCommonsModule
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
