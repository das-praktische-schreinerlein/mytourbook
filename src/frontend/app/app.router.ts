import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SectionsPDocRecordResolver} from './sections/resolver/sections-pdoc-details.resolver';

export const appRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/pages/start'
    },
    {
        path: '',
        outlet: 'navbar',
        component: NavbarComponent,
        resolve: {
            pdocs: SectionsPDocRecordResolver,
        },
    },
    {
        path: '**',
        redirectTo: '/pages/start',
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
