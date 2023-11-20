import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocCreatepageComponent} from './tdoc-createpage.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';

@Component({
    selector: 'app-tdoc-modal-createpage',
    templateUrl: './tdoc-modal-createpage.component.html',
    styleUrls: ['./tdoc-createpage.component.css', '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/styles/cdoc-modal-createpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocModalCreatepageComponent extends TourDocCreatepageComponent {

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: TourDocRoutingService,
                protected toastr: ToastrService, contentUtils: TourDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected tdocDataService: TourDocDataService, router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService,
            platformService, layoutService, tdocDataService, router);
        this.modal = true;
    }

    submitSave(values: {}) {
        const me = this;
        this.cdocDataService.add(values).then(function doneDocCreated(cdoc: TourDocRecord) {
                me.closeModal();
            },
            function errorCreate(reason: any) {
                console.error('create add failed:', reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oje!');
            }
        );
        return false;
    }

}
