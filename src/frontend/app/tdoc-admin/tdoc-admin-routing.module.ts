import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TourDocRecordResolver} from '../shared-tdoc/resolver/tdoc-details.resolver';
import {TourDocEditpageComponent} from './components/tdoc-editpage/tdoc-editpage.component';
import {TourDocRecordCreateResolver} from '../shared-tdoc/resolver/tdoc-create.resolver';
import {TourDocCreatepageComponent} from './components/tdoc-createpage/tdoc-createpage.component';
import {TourDocModalCreatepageComponent} from './components/tdoc-createpage/tdoc-modal-createpage.component';

const tdocAdminRoutes: Routes = [
    {
        path: 'tdocadmin',
        children: [
            {
                path: 'edit/:name/:id',
                component: TourDocEditpageComponent,
                data: {
                    baseSearchUrl: { data: 'tdoc/' }
                },
                resolve: {
                    record: TourDocRecordResolver
                }
            },
            {
                path: 'create/:createByType/:createBaseId',
                component: TourDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'tdoc/' }
                },
                resolve: {
                    record: TourDocRecordCreateResolver
                }
            },
            {
                path: 'create/:createByType',
                component: TourDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'tdoc/' }
                },
                resolve: {
                    record: TourDocRecordCreateResolver
                }
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
    {
        path: 'modaledit',
        children: [
            {
                path: 'create/:createByType/:createBaseId',
                component: TourDocModalCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'tdoc/' }
                },
                resolve: {
                    record: TourDocRecordCreateResolver
                },
            }
        ],
        outlet: 'modaledit',
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(tdocAdminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TourDocAdminRoutingModule {}
