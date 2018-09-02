import {Injectable} from '@angular/core';
import {CommonDocAlbumService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-album.service';

@Injectable()
export class TourDocAlbumService extends CommonDocAlbumService {

    constructor() {
        super();
    }
}
