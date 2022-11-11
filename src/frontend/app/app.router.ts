import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

export const globalAppRoutes: Routes = [
    {
        path: '**',
        redirectTo: '/pages/start',
        data: {
            id: 'global_fallback'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(globalAppRoutes, // must be imported last !!!!
            // { enableTracing: true } // <-- debugging purposes only
        ),
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
