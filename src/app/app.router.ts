import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SDocSearchpageComponent} from './components/sdoc/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './components/sdoc/sdoc-editpage/sdoc-editpage.component';
import {SDocCreatepageComponent} from './components/sdoc/sdoc-createpage/sdoc-createpage.component';

// Route Configuration
export const routes: Routes = [
    {path: '', redirectTo: 'sdocs', pathMatch: 'full'},
    {path: 'sdoc/list', redirectTo: 'sdocs'},
    {path: 'sdocs', component: SDocSearchpageComponent, pathMatch: 'full'},
    {path: 'sdocs/:when/:where/:what/:fulltext/:moreFilter/:sort/:perPage/:pageNum', component: SDocSearchpageComponent},
    {path: 'sdoc/create', component: SDocCreatepageComponent},
    {path: 'sdoc/edit/:id', component: SDocEditpageComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
