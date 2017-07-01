import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Layout} from '../pdoc-list/pdoc-list.component';

@Component({
    selector: 'app-pdoc-list-item',
    templateUrl: './pdoc-list-item.component.html',
    styleUrls: ['./pdoc-list-item.component.css']
})
export class PDocListItemComponent {
    @Input()
    public record: PDocRecord;

    @Input()
    public adminMode = false;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<PDocRecord> = new EventEmitter();

    @Output()
    public edit: EventEmitter<PDocRecord> = new EventEmitter();

    @Output()
    public delete: EventEmitter<PDocRecord> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer) {
    }

    public submitShow(pdoc: PDocRecord) {
        this.show.emit(pdoc);
        return false;
    }
    public getShowUrl(record: PDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl('sections/' + record.id);
    }

}
