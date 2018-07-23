import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {PDocRecord} from '../../../pdoc-commons/model/records/pdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Layout} from '../pdoc-list/pdoc-list.component';

@Component({
    selector: 'app-pdoc-list-item',
    templateUrl: './pdoc-list-item.component.html',
    styleUrls: ['./pdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocListItemComponent {
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
