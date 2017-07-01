import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Layout} from '../pdoc-list/pdoc-list.component';

@Component({
    selector: 'app-pdoc-list-item-flat',
    templateUrl: './pdoc-list-item-flat.component.html',
    styleUrls: ['./pdoc-list-item-flat.component.css']
})
export class PDocListItemFlatComponent {
    @Input()
    public record: PDocRecord;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<PDocRecord> = new EventEmitter();

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
