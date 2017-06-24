import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from './sdoc/components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocSearchFormResolver} from './sdoc/resolver/sdoc-searchform.resolver';
import {NavbarComponent} from './components/navbar/navbar.component';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sdoc/search'
    },
    {
        path: '',
        outlet: 'navbar',
        component: NavbarComponent
    },
    {
        path: 'theme',
        children: [
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

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
