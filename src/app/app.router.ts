import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from './components/sdoc/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './components/sdoc/sdoc-editpage/sdoc-editpage.component';
import {SDocCreatepageComponent} from './components/sdoc/sdoc-createpage/sdoc-createpage.component';
import {SDocShowpageComponent} from './components/sdoc/sdoc-showpage/sdoc-showpage.component';
import {SDocRecordResolver} from './resolver/sdoc-details.resolver';
import {SDocSearchFormResolver} from './resolver/sdoc-searchform.resolver';

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sdocs'
    },
    {
        path: 'sdocs',
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: SDocSearchpageComponent,
                data: {
                    id: 'sdocs_default'
                }
            },
            {
                path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                component: SDocSearchpageComponent,
                data: {
                    flgDoSearch: true,
                    id: 'sdocs_search'
                },
                resolve: {
                    searchForm: SDocSearchFormResolver
                }
            },
            {
                path: '**',
                component: SDocSearchpageComponent,
                data: {
                    id: 'sdocs_fallback'
                }
            }
        ]
    },
    {
        path: 'sdoc',
        children: [
            {
                path: 'create',
                component: SDocCreatepageComponent
            },
            {
                path: 'show/:name/:id',
                component: SDocShowpageComponent,
                resolve: {
                    record: SDocRecordResolver
                }
            },
            {
                path: 'edit/:id',
                component: SDocEditpageComponent,
                resolve: {
                    record: SDocRecordResolver
                }
            },
            {
                path: '**',
                redirectTo: 'sdocs',
                data: {
                    id: 'sdoc_fallback'
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'sdocs',
        data: {
            id: 'global_fallback'
        }
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
