import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {StructuredKeyword} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

@Component({
    selector: 'app-cdoc-keywords',
    templateUrl: './cdoc-keywords.component.html',
    styleUrls: ['./cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocKeywordsComponent extends AbstractInlineComponent implements OnInit {
    blacklist = [];
    keywordsConfig: StructuredKeyword[] = [];
    possiblePrefixes = [];

    @Input()
    public record: CommonDocRecord;

    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                this.configureComponent(config);
            }
        });
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
