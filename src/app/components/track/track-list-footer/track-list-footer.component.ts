import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TrackSearchResult} from '../../../model/container/track-searchresult';

@Component({
    selector: 'app-track-list-footer',
    templateUrl: './track-list-footer.component.html',
    styleUrls: ['./track-list-footer.component.css']
})
export class TrackListFooterComponent {

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
