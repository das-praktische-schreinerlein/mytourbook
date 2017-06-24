import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from './sdoc/components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './sdoc/components/sdoc-editpage/sdoc-editpage.component';
import {SDocCreatepageComponent} from './sdoc/components/sdoc-createpage/sdoc-createpage.component';
import {SDocShowpageComponent} from './sdoc/components/sdoc-showpage/sdoc-showpage.component';
import {SDocRecordResolver} from './sdoc/resolver/sdoc-details.resolver';
import {SDocSearchFormResolver} from './sdoc/resolver/sdoc-searchform.resolver';
import {NavbarComponent} from './shared/components/navbar/navbar.component';

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sdoc/search'
    },
    {
        path: 'sdoc',
        children: [
            {
                path: '',
                outlet: 'navbar',
                component: NavbarComponent
            },
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
    {
        path: 'theme',
        children: [
            {
                path: '',
                outlet: 'navbar',
                component: NavbarComponent
            },
            {
                path: 'klettern',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SDocSearchpageComponent,
                        data: {
                            id: 'theme_klettern_default',
                            baseSearchUrl: 'theme/klettern/'
                        }
                    },
                    {
                        path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'themen_klettern_search',
                            searchFormDefaults: {
                                theme: 'klettern',
                                what: 'kw_klettern'
                            },
                            baseSearchUrl: 'theme/klettern/'
                        },
                        resolve: {
                            searchForm: SDocSearchFormResolver
                        }
                    },
                ]
            },
            {
                path: 'berge',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        component: SDocSearchpageComponent,
                        data: {
                            id: 'theme_berge_default',
                            baseSearchUrl: 'theme/berge/'
                        }
                    },
                    {
                        path: ':when/:where/:what/:fulltext/:moreFilter/:sort/:type/:perPage/:pageNum',
                        component: SDocSearchpageComponent,
                        data: {
                            flgDoSearch: true,
                            id: 'themen_berge_search',
                            searchFormDefaults: {
                                theme: 'berge',
                                what: 'kw_berge'
                            },
                            baseSearchUrl: 'theme/berge/'
                        },
                        resolve: {
                            searchForm: SDocSearchFormResolver
                        }
                    },
                ]
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'sdoc/search',
        data: {
            id: 'global_fallback'
        }
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
