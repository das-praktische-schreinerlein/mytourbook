import {Component, OnDestroy, OnInit} from '@angular/core';
import {Track} from '../../../model/track';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-track-editpage',
  templateUrl: './track-editpage.component.html',
  styleUrls: ['./track-editpage.component.css']
})
export class TrackEditpageComponent implements OnInit, OnDestroy {
  private sub: any;
  public track: Track;

  constructor(private trackDataService: TrackDataService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    // Subscribe to route params
    this.sub = this.route.params.subscribe(params => {
      const trackId = params['trackId'];
      this.track = this.trackDataService.getTrackById(trackId);
    });
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
    this.sub.unsubscribe();
  }

  onSaveTrack(values: {}) {
    this.trackDataService.updateTrackById(values['id'], values);
    this.router.navigateByUrl('/track/list');
  }

}
