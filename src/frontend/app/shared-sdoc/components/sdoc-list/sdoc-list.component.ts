import {Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import { Lightbox } from 'angular2-lightbox';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

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

    private lightboxAlbum = [];
    private lightboxAlbumPos = {};

    constructor(private searchFormConverter: SDocSearchFormConverter, private contentUtils: SDocContentUtils, private lightbox: Lightbox) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            const newlightboxAlbum = [];
            for (let i = 0; i <= this.searchResult.currentRecords.length; i++) {
                const record = this.searchResult.currentRecords[i];
                if (record && record.type === 'IMAGE') {
                    const src = this.contentUtils.getPreview(record['sdocimages'][0]);
                    const caption = record.name;
                    const thumb = this.contentUtils.getThumbnail(record['sdocimages'][0]);
                    const image = {
                        src: src,
                        caption: caption,
                        thumb: thumb,
                        id: record.id
                    };
                    newlightboxAlbum.push(image);
                    this.lightboxAlbumPos[record.id] = newlightboxAlbum.length - 1;
                }
            }
            this.lightboxAlbum = newlightboxAlbum;
        }
    }

    onShow(record: SDocRecord) {
        this.show.emit(record);
        return false;
    }

    onShowImage(record: SDocRecord) {
        if (record.type === 'IMAGE') {
            this.lightbox.open(this.lightboxAlbum, this.lightboxAlbumPos[record.id] || 0);
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
