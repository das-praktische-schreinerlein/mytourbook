import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {Layout} from '../sdoc-list/sdoc-list.component';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

@Component({
    selector: 'app-sdoc-list-item-thin',
    templateUrl: './sdoc-list-item-thin.component.html',
    styleUrls: ['./sdoc-list-item-thin.component.css']
})
export class SDocListItemThinComponent {
    public contentUtils: SDocContentUtils;

    @Input()
    public record: SDocRecord;

    @Input()
    public backToSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public showImage: EventEmitter<SDocRecord> = new EventEmitter();

    constructor(private sanitizer: DomSanitizer, private sdocRoutingService: SDocRoutingService, contentUtils: SDocContentUtils) {
        this.contentUtils = contentUtils;
    }

    public submitShow(sdoc: SDocRecord) {
        this.show.emit(sdoc);
        return false;
    }

    public submitShowImage(sdoc: SDocRecord) {
        this.showImage.emit(sdoc);
        return false;
    }

    public getShowUrl(record: SDocRecord): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.sdocRoutingService.getShowUrl(record, ''));
    }

    public getStyleClassForRecord(record: SDocRecord): string[] {
        return this.contentUtils.getStyleClassForRecord(record, 'thin');
    }
}
