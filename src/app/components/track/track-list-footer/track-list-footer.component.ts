import {Component, Input} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';

@Component({
  selector: 'app-track-list-footer',
  templateUrl: './track-list-footer.component.html',
  styleUrls: ['./track-list-footer.component.css']
})
export class TrackListFooterComponent {

  @Input()
  tracks: TrackRecord[];

  constructor() {
  }

}
