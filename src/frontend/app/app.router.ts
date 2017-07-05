import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SectionsPDocsResolver} from './sections/resolver/sections-pdocs.resolver';

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
            pdocs: SectionsPDocsResolver,
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
