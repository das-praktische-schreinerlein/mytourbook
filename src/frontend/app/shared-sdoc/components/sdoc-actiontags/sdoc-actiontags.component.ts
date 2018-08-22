import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {SDocAlbumService} from '../../services/sdoc-album.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {
    CommonDocActionTagsComponent,
    CommonDocActionTagsComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-actiontags',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocActionTagsComponent extends CommonDocActionTagsComponent {
    constructor(protected appService: GenericAppService, protected contentUtils: SDocContentUtils,
                protected sdocAlbumService: SDocAlbumService, protected cd: ChangeDetectorRef) {
        super(appService, contentUtils, sdocAlbumService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocActionTagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.sdoc-actions.actionTags')) {
            return {
                tagConfigs: config['components']['sdoc-actions']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }
}
