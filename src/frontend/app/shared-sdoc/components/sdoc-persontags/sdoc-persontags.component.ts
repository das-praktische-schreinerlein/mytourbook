import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {StructuredKeyword} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {CDocKeywordsComponent} from '../../../../shared/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';

@Component({
    selector: 'app-sdoc-persontags',
    templateUrl: './sdoc-persontags.component.html',
    styleUrls: ['./sdoc-persontags.component.css'],
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
