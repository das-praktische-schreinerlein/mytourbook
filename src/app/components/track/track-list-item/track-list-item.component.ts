import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Track} from '../../../model/track';

@Component({
  selector: 'app-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrls: ['./track-list-item.component.css']
})
export class TrackListItemComponent {

  @Input()
  public track: Track;

  @Output()
  edit: EventEmitter<Track> = new EventEmitter();

  constructor() {
  }

  editTrack(track: Track) {
    this.edit.emit(track);
  }

}
