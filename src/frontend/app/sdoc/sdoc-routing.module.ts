import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocShowpageComponent} from './components/sdoc-showpage/sdoc-showpage.component';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocSearchpageComponent} from './components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocAlbumResolver} from '../shared-sdoc/resolver/sdoc-album.resolver';
import {SDocAlbumpageComponent} from './components/sdoc-albumpage/sdoc-albumpage.component';

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
                            baseSearchUrl: { data: 'sdoc/' }
                        }
                    },
                    {
                        path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'sdocs_search',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'sdoc/' }
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
                            baseSearchUrl: { data: 'sdoc/' }
                        }
                    }
                ]
            },
            {
                path: 'show/:name/:id',
                component: SDocShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'sdoc/' }
                },
                resolve: {
                    record: SDocRecordResolver
                }
            },
            {
                path: 'album',
                children: [
                    {
                        path: 'edit/:album/:ids',
                        component: SDocAlbumpageComponent,
                        data: {
                            id: 'sdocs_album_list',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'sdoc/album/show/' }
                        },
                        resolve: {
                            searchForm: SDocAlbumResolver
                        }
                    },
                    {
                        path: 'show/:album/:ids',
                        component: SDocAlbumpageComponent,
                        data: {
                            id: 'sdocs_album_show',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'sdoc/' }
                        },
                        resolve: {
                            searchForm: SDocAlbumResolver
                        }
                    },
                ]
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
