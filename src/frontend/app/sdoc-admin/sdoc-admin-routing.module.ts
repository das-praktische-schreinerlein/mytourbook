import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocEditpageComponent} from './components/sdoc-editpage/sdoc-editpage.component';
import {SDocRecordCreateResolver} from '../shared-sdoc/resolver/sdoc-create.resolver';
import {SDocCreatepageComponent} from './components/sdoc-createpage/sdoc-createpage.component';

const sdocAdminRoutes: Routes = [
    {
        path: 'sdocadmin',
        children: [
            {
                path: 'edit/:name/:id',
                component: SDocEditpageComponent,
                data: {
                    baseSearchUrl: { data: 'sdoc/' }
                },
                resolve: {
                    record: SDocRecordResolver
                }
            },
            {
                path: 'create/:createByType',
                component: SDocCreatepageComponent,
                data: {
                    baseSearchUrl: { data: 'sdoc/' }
                },
                resolve: {
                    record: SDocRecordCreateResolver
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
        RouterModule.forChild(sdocAdminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SDocAdminRoutingModule {}
