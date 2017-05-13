import {Component, OnInit} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {Track} from '../../../model/track';
import {Router} from '@angular/router';

@Component({
  selector: 'app-track-searchpage',
  templateUrl: './track-searchpage.component.html',
  styleUrls: ['./track-searchpage.component.css']
})
export class TrackSearchpageComponent implements OnInit {

  tracks: Track[];

  constructor(private trackDataService: TrackDataService, private router: Router) {
  }

  ngOnInit() {
    this.tracks = this.trackDataService.getAllTracks();
  }

  onEditTrack(track: Track) {
    this.router.navigateByUrl('/track/edit/' + track.id);
  }
}
