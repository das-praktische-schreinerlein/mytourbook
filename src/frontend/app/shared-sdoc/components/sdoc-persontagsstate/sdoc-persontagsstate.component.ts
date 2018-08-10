import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocKeywordsstateComponent} from '../sdoc-keywordsstate/sdoc-keywordsstate.component';

@Component({
    selector: 'app-sdoc-persontagsstate',
    templateUrl: './sdoc-persontagsstate.component.html',
    styleUrls: ['./sdoc-persontagsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocPersontagsstateComponent extends SDocKeywordsstateComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }
    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.sdoc-persontags.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.sdoc-persontags.possiblePrefixes');
            this.prefix = BeanUtils.getValue(config, 'components.sdoc-persontags.editPrefix') || '';
            this.updateData();
        } else {
            console.warn('no valid keywordsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.prefix = '';
        }
    }
}
