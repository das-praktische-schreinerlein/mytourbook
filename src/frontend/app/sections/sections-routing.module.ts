import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from '../sdoc/components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocShowpageComponent} from '../sdoc/components/sdoc-showpage/sdoc-showpage.component';
import {SectionsSearchFormResolver} from './resolver/sections-searchform.resolver';
import {SectionsPDocRecordResolver} from './resolver/sections-pdoc-details.resolver';
import {SectionsSDocRecordResolver} from './resolver/sections-sdoc-details.resolver';
import {SectionsBaseUrlResolver} from './resolver/sections-baseurl.resolver';
import {SectionBarComponent} from './components/sectionbar/sectionbar.component';
import {SectionComponent} from './components/section/section.component';
import {SectionPageComponent} from './components/sectionpage/section-page.component';

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
                        component: SectionPageComponent,
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
                        path: 'search/:when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sections_search',
                            searchFormDefaults: {},
                        },
                        resolve: {
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
                        component: SectionPageComponent,
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
