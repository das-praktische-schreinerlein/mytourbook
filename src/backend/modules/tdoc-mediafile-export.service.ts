import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {TourDocServerPlaylistService} from './tdoc-serverplaylist.service';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocMediaFileExportManager} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';

export class TourDocMediaFileExportManager extends CommonDocMediaFileExportManager<TourDocRecord> {
    protected readonly dataService: TourDocDataService;

    constructor(baseDir: string, playlistService: TourDocServerPlaylistService) {
        super(baseDir, playlistService);
    }

    protected getDetailImageRecords(tdoc: TourDocRecord): BaseImageRecord[] {
        return tdoc.get('tdocimages');
    }

    protected getDetailVideoRecords(tdoc: TourDocRecord): BaseVideoRecord[] {
        return tdoc.get('tdocvideos');
    }

    protected getDetailAudioRecords(tdoc: TourDocRecord): BaseAudioRecord[] {
        return tdoc.get('tdocaudios');
    }
}
