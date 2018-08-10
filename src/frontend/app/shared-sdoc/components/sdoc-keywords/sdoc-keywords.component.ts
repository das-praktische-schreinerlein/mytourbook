import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CDocKeywordsComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-keywords',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocKeywordsComponent extends CDocKeywordsComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.sdoc-keywords.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.sdoc-keywords.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.sdoc-keywords.possiblePrefixes');
            this.updateData();
        } else {
            console.warn('no valid keywordsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.updateData();
        }
    }
}
