import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocContentUtils} from '../../services/pdoc-contentutils.service';
import {
    CommonDocActionTagsComponent,
    CommonDocActionTagsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {PDocAlbumService} from '../../services/pdoc-album.service';

@Component({
    selector: 'app-pdoc-actiontags',
    templateUrl: '../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.html',
    styleUrls: ['../../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDocActionTagsComponent extends CommonDocActionTagsComponent {
    constructor(appService: GenericAppService, contentUtils: PDocContentUtils,
                albumService: PDocAlbumService,
                cd: ChangeDetectorRef) {
        super(appService, contentUtils, albumService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocActionTagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.pdoc-actions.actionTags')) {
            return {
                tagConfigs: config['components']['pdoc-actions']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }
}
