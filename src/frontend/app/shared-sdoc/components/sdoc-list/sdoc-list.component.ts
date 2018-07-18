import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocLightboxAlbumConfig, SDocLightBoxService} from '../../services/sdoc-lightbox.service';
import {Layout} from '../../../../shared/angular-commons/services/layout.service';

@Component({
    selector: 'app-sdoc-list',
    templateUrl: './sdoc-list.component.html',
    styleUrls: ['./sdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListComponent implements OnChanges {
    @Input()
    public searchResult: SDocSearchResult;

    @Input()
    public baseSearchUrl: string;

    @Input()
    public layout: Layout;

    @Input()
    public short? = false;

    @Output()
    public show: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public playerStarted: EventEmitter<SDocRecord> = new EventEmitter();

    @Output()
    public playerStopped: EventEmitter<SDocRecord> = new EventEmitter();

    public Layout = Layout;

    private lightboxAlbumConfig: SDocLightboxAlbumConfig = {
        album: [],
        idPos: {}
    };

    constructor(private searchFormConverter: SDocSearchFormConverter,
                private lightboxService: SDocLightBoxService) {
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

    onPlayerStarted(sdoc: SDocRecord) {
        this.playerStarted.emit(sdoc);
    }

    onPlayerStopped(sdoc: SDocRecord) {
        this.playerStopped.emit(sdoc);
    }

    getBackToSearchUrl(searchResult: SDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }
}
