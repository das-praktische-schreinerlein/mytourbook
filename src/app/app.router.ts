import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackSearchpageComponent} from './components/track/track-searchpage/track-searchpage.component';
import {TrackEditpageComponent} from './components/track/track-editpage/track-editpage.component';

// Route Configuration
export const routes: Routes = [
    {path: '', redirectTo: '/track/list', pathMatch: 'full'},
    {path: 'track/list', component: TrackSearchpageComponent},
    {path: 'track/edit/:trackId', component: TrackEditpageComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
