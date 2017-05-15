import {Component, OnInit} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {TrackRecord} from '../../../model/records/track-record';
import {Router} from '@angular/router';

@Component({
  selector: 'app-track-searchpage',
  templateUrl: './track-searchpage.component.html',
  styleUrls: ['./track-searchpage.component.css']
})
export class TrackSearchpageComponent implements OnInit {
  tracks: TrackRecord[];

  constructor(private trackDataService: TrackDataService, private router: Router) {
  }

  ngOnInit() {
    this.trackDataService.getAllTracks().then((tracks) => {
      this.tracks = tracks;
    });
  }

  onEditTrack(track: TrackRecord) {
    this.router.navigateByUrl('/track/edit/' + track.id);
  }
}
