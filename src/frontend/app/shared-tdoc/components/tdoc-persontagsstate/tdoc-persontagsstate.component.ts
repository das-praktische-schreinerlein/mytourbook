import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocKeywordsstateComponent} from '../tdoc-keywordsstate/tdoc-keywordsstate.component';
import {CommonDocKeywordsStateComponentConfig} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component';

@Component({
    selector: 'app-tdoc-persontagsstate',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocPersontagsstateComponent extends TourDocKeywordsstateComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsStateComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-persontags.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.tdoc-persontags.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.tdoc-persontags.possiblePrefixes'),
                prefix: BeanUtils.getValue(config, 'components.tdoc-persontags.editPrefix') || ''
            };
        } else {
            console.warn('no valid persontagsConfig found for components.tdoc-persontags.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                prefix: ''
            };
        }
    }
}
