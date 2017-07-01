import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocEditpageComponent} from '../admin/components/sdoc-editpage/sdoc-editpage.component';
import {SDocShowpageComponent} from './components/sdoc-showpage/sdoc-showpage.component';
import {SDocCreatepageComponent} from '../admin/components/sdoc-createpage/sdoc-createpage.component';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocSearchpageComponent} from './components/sdoc-searchpage/sdoc-searchpage.component';

const sdocRoutes: Routes = [
    {
        path: 'sdoc',
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SDocSearchpageComponent,
                        data: {
                            id: 'sdocs_default',
                            baseSearchUrl: 'sdoc/search/'
                        }
                    },
                    {
                        path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sdocs_search',
                            searchFormDefaults: {},
                            baseSearchUrl: 'sdoc/search/'
                        },
                        resolve: {
                            searchForm: SDocSearchFormResolver
                        }
                    },
                    {
                        path: '**',
                        component: SDocSearchpageComponent,
                        data: {
                            id: 'sdocs_fallback',
                            baseSearchUrl: 'sdoc/search/'
                        }
                    }
                ]
            },
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
                redirectTo: 'sdoc/search',
                data: {
                    id: 'sdoc_fallback'
                }
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(sdocRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SDocRoutingModule {}
