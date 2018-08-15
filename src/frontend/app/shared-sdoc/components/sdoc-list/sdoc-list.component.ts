import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SDocLightboxAlbumConfig, SDocLightBoxService} from '../../services/sdoc-lightbox.service';
import {Layout} from '../../../../shared/angular-commons/services/layout.service';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {CDocListComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component';

@Component({
    selector: 'app-sdoc-list',
    templateUrl: './sdoc-list.component.html',
    styleUrls: ['./sdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocListComponent extends CDocListComponent<SDocRecord, SDocSearchForm, SDocSearchResult> {
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
                private lightboxService: SDocLightBoxService, protected cd: ChangeDetectorRef) {
        super(cd);
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

    protected updateData(): void {
        this.lightboxAlbumConfig = this.lightboxService.createAlbumConfig(this.searchResult);
    }
}
