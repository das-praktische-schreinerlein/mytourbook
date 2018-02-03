import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {SDocContentUtils, StructuredKeyword} from '../../services/sdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';

@Component({
    selector: 'app-sdoc-keywords',
    templateUrl: './sdoc-keywords.component.html',
    styleUrls: ['./sdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocKeywordsComponent implements OnInit, OnChanges {
    keywordKats: StructuredKeyword[] = [];
    blacklist = [];
    keywordsConfig: StructuredKeyword[] = [];

    @Input()
    public record: SDocRecord;

    constructor(private appService: GenericAppService, private contentUtils: SDocContentUtils) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                if (config['components']
                    && config['components']['sdoc-keywords']
                    && config['components']['sdoc-keywords']['structuredKeywords']) {
                    this.keywordsConfig = config['components']['sdoc-keywords']['structuredKeywords'];
                    this.updateData();
                } else {
                    console.warn('no valid keywordsConfig found');
                    this.keywordsConfig = [];
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
        this.keywordKats = [];
        if (this.record === undefined) {
            return;
        }
        this.keywordKats = this.contentUtils.getStructuredKeywords(
            this.keywordsConfig,
            this.record.keywords.split(', '),
            this.blacklist);
    }
}
