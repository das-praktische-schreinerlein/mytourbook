import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {TourDocShowpageComponent} from './components/tdoc-showpage/tdoc-showpage.component';
import {TourDocSearchFormResolver} from '../shared-tdoc/resolver/tdoc-searchform.resolver';
import {TourDocSearchpageComponent} from './components/tdoc-searchpage/tdoc-searchpage.component';
import {TourDocAlbumResolver} from '../shared-tdoc/resolver/tdoc-album.resolver';
import {TourDocAlbumpageComponent} from './components/tdoc-albumpage/tdoc-albumpage.component';

const tdocRoutes: Routes = [
    {
        path: 'tdoc',
        children: [
            {
                path: 'search',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: TourDocSearchpageComponent,
                        data: {
                            id: 'tdocs_default',
                            baseSearchUrl: { data: 'tdoc/' }
                        }
                    },
                    {
                        path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: TourDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'tdocs_search',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'tdoc/' }
                        },
                        resolve: {
                            searchForm: TourDocSearchFormResolver
                        }
                    },
                    {
                        path: '**',
                        component: TourDocSearchpageComponent,
                        data: {
                            id: 'tdocs_fallback',
                            baseSearchUrl: { data: 'tdoc/' }
                        }
                    }
                ]
            },
            {
                path: 'show/:name/:id',
                component: TourDocShowpageComponent,
                data: {
                    baseSearchUrl: { data: 'tdoc/' }
                },
                resolve: {
                    record: TourDocRecordResolver
                }
            },
            {
                path: 'album',
                children: [
                    {
                        path: 'edit/:album/:sort/:perPage/:pageNum',
                        component: TourDocAlbumpageComponent,
                        data: {
                            id: 'tdocs_album_list',
                            flgDoEdit: true,
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'tdoc/album/show/' }
                        },
                        resolve: {
                            searchForm: TourDocAlbumResolver
                        }
                    },
                    {
                        path: 'show/:album/:sort/:perPage/:pageNum',
                        component: TourDocAlbumpageComponent,
                        data: {
                            id: 'tdocs_album_show',
                            searchFormDefaults: {},
                            baseSearchUrl: { data: 'tdoc/' }
                        },
                        resolve: {
                            searchForm: TourDocAlbumResolver
                        }
                    }
                ]
            },
            {
                path: '**',
                redirectTo: 'tdoc/search',
                data: {
                    id: 'tdoc_fallback'
                }
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(tdocRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TourDocRoutingModule {}
