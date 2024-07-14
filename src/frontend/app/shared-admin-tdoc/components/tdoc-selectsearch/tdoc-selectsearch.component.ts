import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {MultiActionTagConfig} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {LatLng} from 'leaflet';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {Router} from '@angular/router';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Component({
    selector: 'app-tdoc-selectsearch',
    templateUrl: './tdoc-selectsearch.component.html',
    styleUrls: ['./tdoc-selectsearch.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSelectSearchComponent extends AbstractInlineComponent {
    public Layout = Layout;
    public selectMultiActionManager = new CommonDocMultiActionManager(this.appService, this.actionService);

    @Input()
    public modal ? = false;

    @Input()
    public baseId: string;

    @Input()
    public type: string;

    @Input()
    public selectFilter: {} = {};

    @Output()
    public appendSelected: EventEmitter<CommonDocRecord[]> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef,
                protected appService: GenericAppService,
                protected actionService: TourDocActionTagService,
                protected router: Router) {
        super(cd);
        this.configureComponent();
    }

    onInputChanged(value: any, field: string): boolean {
        if (field.startsWith('blimblam')) {
        }

        return false;
    }

    onCreateNewRecord(id: string): boolean {
        const me = this;
        // open modal dialog
        me.router.navigate([{ outlets: { 'tdocmodaledit': ['tdocmodaledit', 'create', this.type.toUpperCase(), id] } }]).then(value => {
            // check for closing modal dialog and routechange -> update facets
            const subscription = me.router.events.subscribe((val) => {
                subscription.unsubscribe();
            });
        });


        this.onChangeSelectFilter();

        return false;
    }

    onRecordClickedOnMap(tdoc: TourDocRecord): boolean {
        if (!this.selectMultiActionManager.isRecordOnMultiActionTag(tdoc)) {
            this.selectMultiActionManager.appendRecordToMultiActionTag(tdoc);
        } else {
            this.selectMultiActionManager.removeRecordFromMultiActionTag(tdoc);
        }

        return false;
    }

    onChangeSelectFilter(): boolean {
        this.cd.markForCheck();
        return false;
    }

    onAppendSelectedRecords(): boolean {
        const selectedRecords = this.selectMultiActionManager.getSelectedRecords();

        this.appendSelected.emit(selectedRecords);

        for (const selectedRecord of selectedRecords) {
            this.selectMultiActionManager.removeRecordFromMultiActionTag(selectedRecord);
        }

        return false;
    }

    protected configureComponent(): void {
        const actionTag: MultiActionTagConfig =  {
            configAvailability: [],
            flgUseInput: false,
            flgUseSelect: false,
            recordAvailability: [],
            shortName: '',
            showFilter: [],
            name: 'noop',
            key: 'noop',
            type: 'noop',
            multiRecordTag: true
        };
        actionTag['active'] = true;
        actionTag['available'] = true;

        this.selectMultiActionManager.setSelectedMultiActionTags(
            [
                actionTag
            ]);
    }

    protected updateData(): void {
        //this.updateFormComponents();
    }

}
