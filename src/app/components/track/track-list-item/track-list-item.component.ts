import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';

@Component({
  selector: 'app-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrls: ['./track-list-item.component.css']
})
export class TrackListItemComponent {

  @Input()
  public track: TrackRecord;

  @Output()
  edit: EventEmitter<TrackRecord> = new EventEmitter();

  constructor() {
  }

  editTrack(track: TrackRecord) {
    this.edit.emit(track);
  }

}
