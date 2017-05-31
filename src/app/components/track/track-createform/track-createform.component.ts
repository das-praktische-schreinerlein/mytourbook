import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-track-createform',
    templateUrl: './track-createform.component.html',
    styleUrls: ['./track-createform.component.css']
})
export class TrackCreateformComponent implements OnInit {

    @Input()
    public track: TrackRecord;

    @Output()
    create: EventEmitter<TrackRecord> = new EventEmitter();

    // empty default
    createTrackForm = this.fb.group({
        name: '',
        desc: ''
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        if (this.track) {
            this.createTrackForm = this.fb.group({
                name: [this.track.name, Validators.required],
                desc: [this.track.desc, Validators.required]
            });
        }
    }

    createTrack() {
        this.create.emit(this.createTrackForm.getRawValue());
    }
}
