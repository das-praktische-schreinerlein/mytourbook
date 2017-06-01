import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TrackRecord} from '../../../model/records/track-record';
import {TrackSearchResult} from '../../../model/container/track-searchresult';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css']
})
export class TrackListComponent {

    @Input()
    trackSearchResult: TrackSearchResult;

    @Output()
    edit: EventEmitter<TrackRecord> = new EventEmitter();

    @Output()
    delete: EventEmitter<TrackRecord> = new EventEmitter();

    constructor() {
    }

    onEditTrack(track: TrackRecord) {
        this.edit.emit(track);
    }

    onDeleteTrack(track: TrackRecord) {
        this.delete.emit(track);
    }
}
