import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {
    CommonDocKeywordsStateComponent,
    CommonDocKeywordsStateComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-keywordsstate',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.css'],
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
