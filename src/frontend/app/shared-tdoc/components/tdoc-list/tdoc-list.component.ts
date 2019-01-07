import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {TourDocLightBoxService} from '../../services/tdoc-lightbox.service';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {CommonDocListComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component';
import {CommonDocLightboxAlbumConfig} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-lightbox.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-tdoc-list',
    templateUrl: './tdoc-list.component.html',
    styleUrls: ['./tdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocListComponent extends CommonDocListComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    @Input()
    public showItemMapFlag?: false;

    @Output()
    public showItemOnMap: EventEmitter<CommonDocRecord> = new EventEmitter();

    @Output()
    public playerStarted: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public playerStopped: EventEmitter<TourDocRecord> = new EventEmitter();

    public Layout = Layout;

    private lightboxAlbumConfig: CommonDocLightboxAlbumConfig = {
        album: [],
        idPos: {}
    };

    constructor(private searchFormConverter: TourDocSearchFormConverter,
                private lightboxService: TourDocLightBoxService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    onShowImage(record: TourDocRecord) {
        if (record.type === 'IMAGE') {
            this.lightboxService.openId(this.lightboxAlbumConfig, record.id);
        } else {
            this.show.emit(record);
        }
        return false;
    }

    onPlayerStarted(tdoc: TourDocRecord) {
        this.playerStarted.emit(tdoc);
    }

    onPlayerStopped(tdoc: TourDocRecord) {
        this.playerStopped.emit(tdoc);
    }

    onShowItemOnMap(tdoc: TourDocRecord) {
        this.showItemOnMap.emit(tdoc);
    }

    getBackToSearchUrl(searchResult: TourDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }

    protected updateData(): void {
        this.lightboxAlbumConfig = this.lightboxService.createAlbumConfig(this.searchResult);
    }
}
