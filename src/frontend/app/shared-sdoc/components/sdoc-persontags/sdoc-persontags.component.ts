import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {StructuredKeyword} from '../../services/sdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-persontags',
    templateUrl: './sdoc-persontags.component.html',
    styleUrls: ['./sdoc-persontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocPersonTagsComponent implements OnInit, OnChanges {
    blacklist = [];
    keywordsConfig: StructuredKeyword[] = [];
    possiblePrefixes = [];

    @Input()
    public record: SDocRecord;

    constructor(private appService: GenericAppService, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
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
        });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    private updateData() {
        this.cd.markForCheck();
    }
}
