import {Injectable} from '@angular/core';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocPlaylistService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

@Injectable()
export class TourDocPlaylistService extends CommonDocPlaylistService<TourDocRecord> {

    constructor(protected contentUtils: CommonDocContentUtils) {
        super();
    }

    generateM3uEntityPath(pathPrefix: string, record: TourDocRecord): string {
        return this.contentUtils.getPreferredFullMediaUrl(record);
    }
}
