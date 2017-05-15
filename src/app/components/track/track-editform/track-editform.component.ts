import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-track-editform',
  templateUrl: './track-editform.component.html',
  styleUrls: ['./track-editform.component.css']
})
export class TrackEditformComponent implements OnInit {

  @Input()
  public track: TrackRecord;

  @Output()
  save: EventEmitter<TrackRecord> = new EventEmitter();

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
