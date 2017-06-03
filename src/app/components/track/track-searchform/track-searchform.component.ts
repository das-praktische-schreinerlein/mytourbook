import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {TrackSearchForm} from '../../../model/forms/track-searchform';
import {BehaviorSubject} from 'rxjs';

@Component({
    selector: 'app-track-searchform',
    templateUrl: './track-searchform.component.html',
    styleUrls: ['./track-searchform.component.css']
})
export class TrackSearchformComponent implements OnInit {
    // initialize a private variable _trackSearchForm, it's a BehaviorSubject
    private _trackSearchForm = new BehaviorSubject<TrackSearchForm>(new TrackSearchForm({}));

    @Input()
    public set trackSearchForm(value: TrackSearchForm) {
        // set the latest value for _data BehaviorSubject
        this._trackSearchForm.next(value);
    };

    public get trackSearchForm(): TrackSearchForm {
        // get the latest value from _data BehaviorSubject
        return this._trackSearchForm.getValue();
    }
    @Output()
    search: EventEmitter<TrackSearchForm> = new EventEmitter();

    // empty default
    searchTrackForm = this.fb.group({
        fulltext: ''
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        this._trackSearchForm.subscribe(
            trackSearchForm => {
                const values: TrackSearchForm = trackSearchForm;
                this.searchTrackForm = this.fb.group({
                    fulltext: values.fulltext
                });
            },
        );
    }

    searchTracks() {
        this.search.emit(this.searchTrackForm.getRawValue());
    }
}
