import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CDocKeywordsStateComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-keywordsstate',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-keywordsstate/cdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SdocKeywordsstateComponent extends CDocKeywordsStateComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.cdoc-keywords.possiblePrefixes');
            this.prefix = BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix') || '';
            this.updateData();
        } else {
            console.warn('no valid keywordsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.prefix = '';
        }
    }
}
