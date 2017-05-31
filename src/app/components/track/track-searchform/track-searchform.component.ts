import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {FormBuilder, Validators} from '@angular/forms';
import {TrackSearchForm} from '../../../model/forms/track-searchform';

@Component({
    selector: 'app-track-searchform',
    templateUrl: './track-searchform.component.html',
    styleUrls: ['./track-searchform.component.css']
})
export class TrackSearchformComponent implements OnInit {

    @Input()
    public trackSearchForm: TrackSearchForm;

    @Output()
    search: EventEmitter<TrackSearchForm> = new EventEmitter();

    // empty default
    searchTrackForm = this.fb.group({
        fulltext: ''
    });

    constructor(public fb: FormBuilder) {
        console.log('create TrackSearchformComponent:', this.trackSearchForm);
        if (this.trackSearchForm) {
            this.searchTrackForm = this.fb.group({
                fulltext: this.trackSearchForm.fulltext
            });
        }
    }

    ngOnInit() {
    }

    searchTracks() {
        this.search.emit(this.searchTrackForm.getRawValue());
    }
}
