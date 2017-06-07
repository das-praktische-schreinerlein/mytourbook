import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';

@Component({
    selector: 'app-sdoc-list',
    templateUrl: './sdoc-list.component.html',
    styleUrls: ['./sdoc-list.component.css']
})
export class SDocListComponent {

    @Input()
    searchResult: SDocSearchResult;

    @Output()
    edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    delete: EventEmitter<SDocRecord> = new EventEmitter();

    constructor() {
    }

    onEdit(record: SDocRecord) {
        this.edit.emit(record);
    }

    onDelete(record: SDocRecord) {
        this.delete.emit(record);
    }
}
