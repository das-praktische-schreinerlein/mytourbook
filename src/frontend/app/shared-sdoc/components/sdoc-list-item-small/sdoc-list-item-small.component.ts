import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocRoutingService} from '../../../sdoc/services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {SDocContentUtils} from '../../../sdoc/services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-list-item-small',
    templateUrl: './sdoc-list-item-small.component.html',
    styleUrls: ['./sdoc-list-item-small.component.css']
})
export class SDocListItemSmallComponent {
    public contentUtils: SDocContentUtils;

    @Input()
    public record: SDocRecord;

    @Input()
    public adminMode = false;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public edit: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public delete: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private sdocRoutingService: SDocRoutingService, contentUtils: SDocContentUtils) {
        this.contentUtils = contentUtils;
    }

    public submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    public submitEdit(sdoc: SDocRecord) {
        this.edit.emit(sdoc);
        return false;
    }

    public submitDelete(sdoc: SDocRecord) {
        this.delete.emit(sdoc);
        return false;
    }

    public getShowUrl(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.sdocRoutingService.getShowUrl(record, ''));
    }

}
