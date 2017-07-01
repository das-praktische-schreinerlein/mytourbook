import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';

export enum Layout {
    FLAT,
    SMALL,
    BIG
}

@Component({
    selector: 'app-pdoc-list',
    templateUrl: './pdoc-list.component.html',
    styleUrls: ['./pdoc-list.component.css']
})
export class PDocListComponent {
    @Input()
    public records: PDocRecord[];

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<PDocRecord> = new EventEmitter();

    public Layout = Layout;

    constructor() {
    }

    onShow(record: PDocRecord) {
        this.show.emit(record);
        return false;
    }
}
