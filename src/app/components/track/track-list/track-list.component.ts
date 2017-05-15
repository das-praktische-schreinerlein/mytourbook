import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent {

  @Input()
  tracks: TrackRecord[];

  @Output()
  edit: EventEmitter<TrackRecord> = new EventEmitter();

  constructor() {
  }

  onEditTrack(track: TrackRecord) {
    this.edit.emit(track);
  }

}
