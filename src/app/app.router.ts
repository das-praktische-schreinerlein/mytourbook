import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrackSearchpageComponent} from './components/track/track-searchpage/track-searchpage.component';
import {TrackEditpageComponent} from './components/track/track-editpage/track-editpage.component';
import {TrackCreatepageComponent} from './components/track/track-createpage/track-createpage.component';

// Route Configuration
export const routes: Routes = [
    {path: '', redirectTo: 'tracks', pathMatch: 'full'},
    {path: 'track/list', redirectTo: 'tracks'},
    {path: 'tracks', component: TrackSearchpageComponent, pathMatch: 'full'},
    {path: 'tracks/:when/:where/:what/:fulltext/:moreFilter/:sort/:perPage/:pageNum', component: TrackSearchpageComponent},
    {path: 'track/create', component: TrackCreatepageComponent},
    {path: 'track/edit/:trackId', component: TrackEditpageComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
