import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocEditpageComponent} from './components/sdoc-editpage/sdoc-editpage.component';

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
