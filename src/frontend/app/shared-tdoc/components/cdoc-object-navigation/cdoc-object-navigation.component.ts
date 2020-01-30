import {ChangeDetectorRef, Input} from '@angular/core';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {BaseNavigationObjectRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basenavigationobject-record';

export abstract class CommonDocObjectNavigationComponent extends AbstractInlineComponent {

    @Input()
    public baseSearchUrl? = 'cdoc/';

    @Input()
    public navigationobjects: BaseNavigationObjectRecordType[];

    constructor(protected commonRoutingService: CommonRoutingService, cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
    }

    getNavigationObjectRecordUrl(navRecord: BaseNavigationObjectRecordType): string {
        const name = StringUtils.generateTechnicalName(navRecord.name ? navRecord.name : 'name');
        return this.baseSearchUrl + 'show/' + name + '/' + navRecord.navid;
    }

    navigateToRecord(navRecord: BaseNavigationObjectRecordType): boolean {
        this.commonRoutingService.navigateByUrl(this.getNavigationObjectRecordUrl(navRecord));
        return false;
    }


}
