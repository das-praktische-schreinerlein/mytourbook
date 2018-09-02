import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {
    CommonDocKeywordsStateComponent,
    CommonDocKeywordsStateComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-keywordsstate',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocKeywordsstateComponent extends CommonDocKeywordsStateComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsStateComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-keywords.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.tdoc-keywords.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.tdoc-keywords.possiblePrefixes'),
                prefix: BeanUtils.getValue(config, 'components.tdoc-keywords.editPrefix') || ''
            };
        } else {
            console.warn('no valid keywordsConfig found for components.tdoc-keywords.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                prefix: ''
            };
        }
    }
}
