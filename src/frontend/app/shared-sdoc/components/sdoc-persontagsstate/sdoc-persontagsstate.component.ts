import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocKeywordsstateComponent} from '../sdoc-keywordsstate/sdoc-keywordsstate.component';
import {CDocKeywordsStateComponentConfig} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component';

@Component({
    selector: 'app-sdoc-persontagsstate',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocPersontagsstateComponent extends SDocKeywordsstateComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CDocKeywordsStateComponentConfig {
        if (BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.sdoc-persontags.possiblePrefixes'),
                prefix: BeanUtils.getValue(config, 'components.sdoc-persontags.editPrefix') || ''
            };
        } else {
            console.warn('no valid persontagsConfig found for components.sdoc-persontags.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                prefix: ''
            };
        }
    }
}
