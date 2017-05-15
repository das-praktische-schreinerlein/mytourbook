import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TrackDataService} from './services/track-data.service';
import {TrackRecord} from './model/records/track-record';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
  title = 'MyTourBook';

  constructor(private router: Router, private trackDataService: TrackDataService) {
    trackDataService.addTrack(new TrackRecord({id: 1, name: 'Testtrack1'}));
    trackDataService.addTrack(new TrackRecord({id: 2, name: 'Testtrack2'}));
  }

}
