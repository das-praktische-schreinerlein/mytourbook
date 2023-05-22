import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PDocRecordResolver} from '../shared-pdoc/resolver/pdoc-details.resolver';
import {PDocEditpageComponent} from './components/pdoc-editpage/pdoc-editpage.component';
import {PDocRecordCreateResolver} from '../shared-admin-pdoc/resolver/pdoc-create.resolver';
import {PDocCreatepageComponent} from './components/pdoc-createpage/pdoc-createpage.component';
import {PDocModalCreatepageComponent} from './components/pdoc-createpage/pdoc-modal-createpage.component';

const pdocAdminRoutes: Routes = [
    {
        path: 'pdocadmin',
        children: [
            {
                path: 'edit/:name/:id',
                component: PDocEditpageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordResolver
                }
            },
            {
                path: 'create/:createByType/:createBaseId',
                component: PDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordCreateResolver
                }
            },
            {
                path: 'create/:createByType',
                component: PDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordCreateResolver
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
        path: 'pdocmodaledit',
        children: [
            {
                path: 'create/:createByType/:createBaseId',
                component: PDocModalCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'pdoc/' }
                },
                resolve: {
                    record: PDocRecordCreateResolver
                },
            }
        ],
        outlet: 'pdocmodaledit',
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(pdocAdminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PDocAdminRoutingModule {}
