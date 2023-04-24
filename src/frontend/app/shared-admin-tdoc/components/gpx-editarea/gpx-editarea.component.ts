import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {TourDocRecord, TourDocRecordFactory} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {GeoGpxParser} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geogpx.parser';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {GpsTrackValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {DOCUMENT} from '@angular/common';
import {GeoParserDeterminer} from '@dps/mycms-frontend-commons/dist/angular-maps/services/geo-parser.determiner';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {AbstractGpxEditAreaComponent} from './abstract-gpx-editarea.component';

@Component({
    selector: 'app-gpx-editarea',
    templateUrl: './gpx-editarea.component.html',
    styleUrls: ['./gpx-editarea.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpxEditAreaComponent extends AbstractGpxEditAreaComponent {
    constructor(fb: FormBuilder, toastr: ToastrService, cd: ChangeDetectorRef,
                appService: GenericAppService, geoParserService: GeoParserDeterminer, gpxParser: GeoGpxParser,
                @Inject(DOCUMENT) document) {
        super(fb, toastr, cd, appService, geoParserService, gpxParser, document,
            (<GpsTrackValidationRule>TourDocRecord.tdocFields.gpsTrackSrc.validator).getMaxLength());
    }

    protected createSanitized(values: {}): CommonDocRecord {
        return TourDocRecordFactory.createSanitized(values);
    }
}
