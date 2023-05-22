import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PDocSearchpageComponent} from './components/pdoc-searchpage/pdoc-searchpage.component';
import {PDocSearchFormResolver} from '../shared-pdoc/resolver/pdoc-searchform.resolver';
import {PDocShowpageComponent} from './components/pdoc-showpage/pdoc-showpage.component';
import {PDocRecordResolver} from '../shared-pdoc/resolver/pdoc-details.resolver';
import {PDocModalShowpageComponent} from './components/pdoc-showpage/pdoc-modal-showpage.component';

const pdocRoutes: Routes = [
    {
        path: 'pdoc',
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: PDocSearchpageComponent,
                        data: {
                            id: 'pdocs_default',
                            baseSearchUrl: { data: 'pdoc/' }
                        }
                    },
                    {
                        path: ':what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: PDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'pdocs_search',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'pdoc/' }
                        },
                        resolve: {
                            searchForm: PDocSearchFormResolver
                        }
                    },
                    {
                        path: '**',
                        component: PDocSearchpageComponent,
                        data: {
                            id: 'pdocs_fallback',
                            baseSearchUrl: { data: 'pdoc/' }
                        }
                    }
                ]
            },
            {
                path: 'show/:name/:id',
                component: PDocShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordResolver
                }
            },
            {
                path: '**',
                redirectTo: 'pdoc/search',
                data: {
                    id: 'pdoc_fallback'
                }
            }
        ]
    },
    {
        path: 'pdocmodalshow',
        children: [
            {
                path: 'show/:name/:id',
                component: PDocModalShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordResolver
                }
            }
        ],
        outlet: 'pdocmodalshow',
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(pdocRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PDocRoutingModule {}
