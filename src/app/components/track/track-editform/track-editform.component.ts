import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Track} from '../../../model/track';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-track-editform',
  templateUrl: './track-editform.component.html',
  styleUrls: ['./track-editform.component.css']
})
export class TrackEditformComponent implements OnInit {

  @Input()
  public track: Track;

  @Output()
  save: EventEmitter<Track> = new EventEmitter();

  // empty default
  editTrackForm = this.fb.group({
    id: '',
    name: '',
    persons: ''
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    if (this.track) {
      this.editTrackForm = this.fb.group({
        id: this.track.id,
        name: [this.track.name, Validators.required],
        persons: [this.track.persons, Validators.required]
      });
    }
  }

  saveTrack() {
    this.save.emit(this.editTrackForm.getRawValue());
  }
}
