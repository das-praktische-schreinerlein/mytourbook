import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {TourDocAlbumService} from '../../services/tdoc-album.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {
    CommonDocActionTagsComponent,
    CommonDocActionTagsComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-tdoc-actiontags',
    templateUrl: '../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.html',
    styleUrls: ['../../../../shared/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.css'],
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
