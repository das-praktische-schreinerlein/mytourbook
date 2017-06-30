import {NgModule} from '@angular/core';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsSDocRecordResolver} from './resolver/sections-sdoc-details.resolver';
import {SectionsRoutingModule} from './sections-routing.module';
import {SectionsBaseUrlResolver} from './resolver/sections-baseurl.resolver';
import {SectionBarComponent} from './components/sectionbar/sectionbar.component';
import {SectionsPDocRecordResolver} from './resolver/sections-pdoc-details.resolver';
import {SectionComponent} from './components/section/section.component';
import {SectionPageComponent} from './components/sectionpage/section-page.component';
import {BrowserModule} from '@angular/platform-browser';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';

@NgModule({
    declarations: [
        SectionComponent,
        SectionPageComponent,
        SectionBarComponent
    ],
    imports: [
        BrowserModule,
        SharedSDocModule,
        SectionsRoutingModule
    ],
    providers: [
        SectionsBaseUrlResolver,
        SectionsSearchFormResolver,
        SectionsSDocRecordResolver,
        SectionsPDocRecordResolver
    ]
})
export class SectionsModule {}
