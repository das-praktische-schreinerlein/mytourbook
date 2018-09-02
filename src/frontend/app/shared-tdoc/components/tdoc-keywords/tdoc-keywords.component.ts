import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocKeywordsComponent,
    CommonDocKeywordsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-keywords',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocKeywordsComponent extends CommonDocKeywordsComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-keywords.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.tdoc-keywords.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.tdoc-keywords.possiblePrefixes'),
                blacklist: []
            };
        } else {
            console.warn('no valid keywordsConfig found for components.tdoc-keywords.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                blacklist: []
            };
        }
    }
}
