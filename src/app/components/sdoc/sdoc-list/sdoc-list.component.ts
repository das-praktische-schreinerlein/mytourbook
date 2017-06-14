import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../../services/sdoc-searchform-converter.service';

export enum Layout {
    SMALL,
    BIG
}

@Component({
    selector: 'app-sdoc-list',
    templateUrl: './sdoc-list.component.html',
    styleUrls: ['./sdoc-list.component.css']
})
export class SDocListComponent {
    @Input()
    searchResult: SDocSearchResult;

    @Input()
    adminMode: boolean;

    @Input()
    layout: Layout;

    @Output()
    show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    delete: EventEmitter<SDocRecord> = new EventEmitter();

    Layout = Layout;

    constructor(private searchFormConverter: SDocSearchFormConverter) {
    }

    onShow(record: SDocRecord) {
        this.show.emit(record);
        return false;
    }

    onEdit(record: SDocRecord) {
        this.edit.emit(record);
        return false;
    }

    onDelete(record: SDocRecord) {
        this.delete.emit(record);
        return false;
    }

    getBackToSearchUrl(searchResult: SDocSearchResult): string {
        return (searchResult.searchForm ? this.searchFormConverter.searchFormToUrl('/sdocs/', searchResult.searchForm) : undefined);
    }
}
