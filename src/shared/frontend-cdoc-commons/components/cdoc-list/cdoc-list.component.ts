import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {Layout} from '../../../angular-commons/services/layout.service';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchResult} from '../../../search-commons/model/container/cdoc-searchresult';
import {CommonDocSearchForm} from '../../../search-commons/model/forms/cdoc-searchform';

@Component({
    selector: 'app-cdoc-list',
    templateUrl: './cdoc-list.component.html',
    styleUrls: ['./cdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocListComponent <R extends CommonDocRecord, F extends CommonDocSearchForm,
    S extends CommonDocSearchResult<R, F>> implements OnChanges {
    @Input()
    public searchResult: S;

    @Input()
    public baseSearchUrl: string;

    @Input()
    public layout: Layout;

    @Input()
    public short? = false;

    @Output()
    public show: EventEmitter<R> = new EventEmitter();

    public Layout = Layout;

    constructor() {}

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    }

    onShow(record: R) {
        this.show.emit(record);
        return false;
    }

    getBackToSearchUrl(searchResult: S): string {
        return '';
    }
}
