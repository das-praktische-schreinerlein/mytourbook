import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {CommonDocAssignPlaylistFormComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';

@Component({
    selector: 'app-tdoc-assignplaylistform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAssignPlaylistFormComponent
    extends CommonDocAssignPlaylistFormComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, tdocDataService: TourDocDataService, toastr: ToastrService,
                appService: GenericAppService) {
        super(fb, activeModal, cd, searchFormUtils, tdocDataService, toastr, appService);
    }

    protected getReferenceNameForRecordType(type: string): string {
        switch (type) {
            case 'IMAGE':
            case 'INFO':
            case 'LOCATION':
            case 'ROUTE':
            case 'TRACK':
            case 'TRIP':
            case 'VIDEO':
            case undefined:
                return 'playlists_max_txt';
            default:
                return undefined;
        }
    }
}
