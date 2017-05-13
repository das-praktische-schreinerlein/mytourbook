import {Component, Input} from '@angular/core';
import {Track} from '../../../model/track';

@Component({
  selector: 'app-track-list-footer',
  templateUrl: './track-list-footer.component.html',
  styleUrls: ['./track-list-footer.component.css']
})
export class TrackListFooterComponent {

  @Input()
  tracks: Track[];

  constructor() {
  }

}
