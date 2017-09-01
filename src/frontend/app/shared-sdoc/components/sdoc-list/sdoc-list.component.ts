import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocLightboxAlbumConfig, SDocLightBox} from '../../services/sdoc-lightbox.service';

export enum Layout {
    FLAT,
    SMALL,
    BIG,
    PAGE
}

@Component({
    selector: 'app-sdoc-list',
    templateUrl: './sdoc-list.component.html',
    styleUrls: ['./sdoc-list.component.css']
})
export class SDocListComponent implements OnChanges {
    @Input()
    public searchResult: SDocSearchResult;

    @Input()
    public baseSearchUrl: string;

    @Input()
    public layout: Layout;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    public Layout = Layout;

    private lightboxAlbumConfig: SDocLightboxAlbumConfig = {
        album: [],
        idPos: {}
    };

    constructor(private searchFormConverter: SDocSearchFormConverter,
                private lightboxService: SDocLightBox) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.lightboxAlbumConfig = this.lightboxService.createAlbumConfig(this.searchResult);
        }
    }

    onShow(record: SDocRecord) {
        this.show.emit(record);
        return false;
    }

    onShowImage(record: SDocRecord) {
        if (record.type === 'IMAGE') {
            this.lightboxService.openId(this.lightboxAlbumConfig, record.id);
        } else {
            this.show.emit(record);
        }
        return false;
    }

    getBackToSearchUrl(searchResult: SDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }
}
