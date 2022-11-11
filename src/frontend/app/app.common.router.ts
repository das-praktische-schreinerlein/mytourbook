import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SectionsPDocsResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/sections-pdocs.resolver';
import {ErrorPageComponent} from './components/errorpage/errorpage.component';

export const appRoutes: Routes = [
    {
        path: 'errorpage',
        pathMatch: 'full',
        component: ErrorPageComponent
    },
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
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes),
    ],
    exports: [
        RouterModule
    ]
})
export class AppCommonRoutingModule {}
