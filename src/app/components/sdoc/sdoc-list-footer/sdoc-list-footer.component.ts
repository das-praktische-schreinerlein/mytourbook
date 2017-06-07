import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';

@Component({
    selector: 'app-sdoc-list-footer',
    templateUrl: './sdoc-list-footer.component.html',
    styleUrls: ['./sdoc-list-footer.component.css']
})
export class SDocListFooterComponent {

    @Input()
    searchResult: SDocSearchResult;

    @Output()
    pageChange: EventEmitter<number> = new EventEmitter();

    constructor() {
    }

    onPageChange(page: number) {
        this.pageChange.emit(page);
    }
}
