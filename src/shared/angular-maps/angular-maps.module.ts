import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LeafletMapComponent} from './components/leaflet-map/leaflet-map.component';

@NgModule({
    declarations: [
        LeafletMapComponent
    ],
    imports: [
        NgbModule,
        HttpModule
    ],
    providers: [
    ],
    exports: [
        LeafletMapComponent
    ]
})
export class AngularMapsModule {}
