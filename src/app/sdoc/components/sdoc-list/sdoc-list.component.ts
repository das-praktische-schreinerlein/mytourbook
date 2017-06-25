import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {SDocSearchResult} from '../../../sdocshared/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';

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
    public searchResult: SDocSearchResult;

    @Input()
    public adminMode: boolean;

    @Input()
    public baseSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public delete: EventEmitter<SDocRecord> = new EventEmitter();

    public Layout = Layout;

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
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }
}
