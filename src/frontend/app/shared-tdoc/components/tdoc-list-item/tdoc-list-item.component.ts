import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {
    CommonDocListItemComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import removeMarkdown from 'markdown-to-text';

@Component({
    selector: 'app-tdoc-list-item',
    templateUrl: './tdoc-list-item.component.html',
    styleUrls: ['./tdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListItemComponent extends CommonDocListItemComponent {
    protected mapFlagSymbol = '&#128681';
    protected mapFlagAvailable = false;

    @Input()
    public showItemMapFlag ? = false;

    @Input()
    public showItemObjectsFlag ? = false;

    @Output()
    public showItemOnMap: EventEmitter<CommonDocRecord> = new EventEmitter();

    @ViewChild('mainImage')
    mainImage: ElementRef;
    imageWidth = 0;

    constructor(contentUtils: TourDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }

    public submitShowItemOnMap(tdoc: TourDocRecord) {
        this.showItemOnMap.emit(tdoc);
        return false;
    }

    onResizeMainImage() {
        if (this.mainImage && this.mainImage.nativeElement && this.mainImage.nativeElement['width']) {
            this.imageWidth = this.mainImage.nativeElement['width'];
            this.cd.markForCheck();
        }
    }

    getDesc(): string {
        if (!this.record || this.record.descMd === undefined || this.record.descMd.toLowerCase() === 'tododesc') {
            return;
        }

        if (this.record.descTxt) {
            return this.record.descTxt;
        }

        if (this.record.descMd) {
            return removeMarkdown(this.record.descMd);
        }

        return '';
    }

    protected updateData() {
        const tdocRecord: TourDocRecord = <TourDocRecord>this.record;
        if (tdocRecord && this.showItemMapFlag && (tdocRecord.geoLat || tdocRecord.gpsTrackSrc || tdocRecord.gpsTrackBasefile)) {
            this.mapFlagAvailable = true;
        } else {
            this.mapFlagAvailable = false;
        }

        super.updateData();
        this.cd.markForCheck();
    }

}
