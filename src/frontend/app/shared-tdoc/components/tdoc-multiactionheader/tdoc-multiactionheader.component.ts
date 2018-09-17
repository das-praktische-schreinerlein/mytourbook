import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {
    CommonDocMultiActionHeaderComponent,
    CommonDocMultiActionHeaderComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component';
import {BeanUtils} from '@dps//mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-multiactionheader',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocMultiActionHeaderComponent extends
    CommonDocMultiActionHeaderComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    constructor(protected appService: GenericAppService, protected contentUtils: TourDocContentUtils, protected cd: ChangeDetectorRef) {
        super(appService, contentUtils, cd);
    }

    protected getComponentConfig(config: {}): CommonDocMultiActionHeaderComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-multiactionheader.actionTags')) {
            return {
                tagConfigs: config['components']['tdoc-multiactionheader']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }

}
