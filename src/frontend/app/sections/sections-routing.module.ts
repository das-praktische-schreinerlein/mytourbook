import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from '../sdoc/components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocShowpageComponent} from '../sdoc/components/sdoc-showpage/sdoc-showpage.component';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsPDocRecordResolver} from '../../shared/frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {SectionsSDocRecordResolver} from './resolver/sections-sdoc-details.resolver';
import {SectionsBaseUrlResolver} from '../../shared/frontend-cdoc-commons/resolver/sections-baseurl.resolver';
import {SectionBarComponent} from '../../shared/frontend-pdoc-commons/components/sectionbar/sectionbar.component';
import {SectionComponent} from '../../shared/frontend-pdoc-commons/components/section/section.component';
import {SDocSectionPageComponent} from './components/sectionpage/sdoc-section-page.component';

const sectionRoutes: Routes = [
    {
        path: 'sections',
        children: [
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SDocSectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    },
                    {
                        path: 'show/:name/:id',
                        component: SDocShowpageComponent,
                        pathMatch: 'full',
                        data: {
                            id: 'sections_show'
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            record: SectionsSDocRecordResolver
                        }
                    },
                    {
                        path: 'search',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search_default',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    },
                    {
                        path: 'search/:type',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search_types',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    },
                    {
                        path: 'search/:when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search',
                            searchFormDefaults: {},
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            searchForm: SectionsSearchFormResolver
                        }
                    }
                ]
            }
        ]
    },
    {
        path: 'pages',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'pages/start'
            },
            {
                path: ':section',
                component: SectionComponent,
                children: [
                    {
                        path: '',
                        outlet: 'sectionbar',
                        component: SectionBarComponent,
                        resolve: {
                            pdoc: SectionsPDocRecordResolver
                        }
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SDocSectionPageComponent,
                        data: {
                            id: 'sections_section',
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver
                        },
                    }
                ]
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(sectionRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SectionsRoutingModule {}
