import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {
    CommonDocKeywordsComponent,
    CommonDocKeywordsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';

@Component({
    selector: 'app-tdoc-persontags',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocPersonTagsComponent extends CommonDocKeywordsComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-persontags.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.tdoc-persontags.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.tdoc-persontags.possiblePrefixes'),
                blacklist: []
            };
        } else {
            console.warn('no valid persontagsConfig found for components.tdoc-persontags.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                blacklist: []
            };
        }
    }
}
