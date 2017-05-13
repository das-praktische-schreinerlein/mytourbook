import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Track} from '../../../model/track';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent {

  @Input()
  tracks: Track[];

  @Output()
  edit: EventEmitter<Track> = new EventEmitter();

  constructor() {
  }

  onEditTrack(track: Track) {
    this.edit.emit(track);
  }

}
