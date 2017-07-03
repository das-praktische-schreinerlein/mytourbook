import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LeafletMapComponent} from './components/leaflet-map/leaflet-map.component';
import {VisJsProfileMapComponent} from './components/visjs-profilemap/visjs-profilemap.component';

@NgModule({
    declarations: [
        LeafletMapComponent,
        VisJsProfileMapComponent
    ],
    imports: [
        NgbModule,
        HttpModule
    ],
    providers: [
    ],
    exports: [
        LeafletMapComponent,
        VisJsProfileMapComponent
    ]
})
export class AngularMapsModule {}
