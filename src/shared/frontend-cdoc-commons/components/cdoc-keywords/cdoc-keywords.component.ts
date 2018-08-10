import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {ComponentUtils} from '../../../angular-commons/services/component.utils';
import {StructuredKeyword} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';

@Component({
    selector: 'app-cdoc-keywords',
    templateUrl: './cdoc-keywords.component.html',
    styleUrls: ['./cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocKeywordsComponent implements OnInit, OnChanges {
    blacklist = [];
    keywordsConfig: StructuredKeyword[] = [];
    possiblePrefixes = [];

    @Input()
    public record: CommonDocRecord;

    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                this.configureComponent(config);
            }
        });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.cdoc-keywords.possiblePrefixes');
            this.updateData();
        } else {
            console.warn('no valid keywordsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.updateData();
        }
    }

    protected updateData() {
        this.cd.markForCheck();
    }
}
