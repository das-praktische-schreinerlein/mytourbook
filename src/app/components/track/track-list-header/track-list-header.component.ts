import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TrackSearchResult} from '../../../model/container/track-searchresult';

@Component({
    selector: 'app-track-list-header',
    templateUrl: './track-list-header.component.html',
    styleUrls: ['./track-list-header.component.css']
})
export class TrackListHeaderComponent {

    @Input()
    trackSearchResult: TrackSearchResult;

    @Output()
    pageChange: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }
}
