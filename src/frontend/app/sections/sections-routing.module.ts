import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TourDocSearchpageComponent} from '../tdoc/components/tdoc-searchpage/tdoc-searchpage.component';
import {TourDocShowpageComponent} from '../tdoc/components/tdoc-showpage/tdoc-showpage.component';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsPDocRecordResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-pdoc-details.resolver';
import {SectionsTourDocRecordResolver} from './resolver/sections-tdoc-details.resolver';
import {SectionsBaseUrlResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-baseurl.resolver';
import {SectionBarComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/sectionbar/sectionbar.component';
import {SectionComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/section/section.component';
import {TourDocSectionPageComponent} from './components/sectionpage/tdoc-section-page.component';

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
                        component: TourDocSectionPageComponent,
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
                        component: TourDocShowpageComponent,
                        pathMatch: 'full',
                        data: {
                            id: 'sections_show'
                        },
                        resolve: {
                            pdoc: SectionsPDocRecordResolver,
                            baseSearchUrl: SectionsBaseUrlResolver,
                            record: SectionsTourDocRecordResolver
                        }
                    },
                    {
                        path: 'search',
                        component: TourDocSearchpageComponent,
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
                        component: TourDocSearchpageComponent,
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
                        component: TourDocSearchpageComponent,
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
                        component: TourDocSectionPageComponent,
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
