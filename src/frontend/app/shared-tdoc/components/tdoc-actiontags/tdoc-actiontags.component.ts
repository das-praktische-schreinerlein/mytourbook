import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocAlbumService} from '../../services/tdoc-album.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {
    CommonDocActionTagsComponent,
    CommonDocActionTagsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-actiontags',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocActionTagsComponent extends CommonDocActionTagsComponent {
    constructor(protected appService: GenericAppService, protected contentUtils: TourDocContentUtils,
                protected tdocAlbumService: TourDocAlbumService, protected cd: ChangeDetectorRef) {
        super(appService, contentUtils, tdocAlbumService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocActionTagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.tdoc-actions.actionTags')) {
            return {
                tagConfigs: config['components']['tdoc-actions']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }
}
