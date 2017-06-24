import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocSearchResult} from '../../model/container/sdoc-searchresult';

@Component({
    selector: 'app-sdoc-list-header',
    templateUrl: './sdoc-list-header.component.html',
    styleUrls: ['./sdoc-list-header.component.css']
})
export class SDocListHeaderComponent {

    @Input()
    public searchResult: SDocSearchResult;

    @Output()
    public pageChange: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }
}
