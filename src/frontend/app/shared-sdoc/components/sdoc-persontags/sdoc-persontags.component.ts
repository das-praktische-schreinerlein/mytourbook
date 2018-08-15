import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {CDocKeywordsComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';

@Component({
    selector: 'app-sdoc-persontags',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocPersonTagsComponent extends CDocKeywordsComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.sdoc-persontags.possiblePrefixes');
            this.updateData();
        } else {
            console.warn('no valid persontagsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.updateData();
        }
    }
}
