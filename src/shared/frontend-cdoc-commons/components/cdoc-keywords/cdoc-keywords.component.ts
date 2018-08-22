import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {StructuredKeyword} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {CommonDocRecord} from '../../../search-commons/model/records/cdoc-entity-record';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

export interface CommonDocKeywordsComponentConfig {
    blacklist: string[];
    keywordsConfig: StructuredKeyword[];
    possiblePrefixes: string[];
}

@Component({
    selector: 'app-cdoc-keywords',
    templateUrl: './cdoc-keywords.component.html',
    styleUrls: ['./cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonDocKeywordsComponent extends AbstractInlineComponent implements OnInit {
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
                this.updateData();
            }
        });
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsComponentConfig {
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.cdoc-keywords.possiblePrefixes'),
                blacklist: []
            };
        } else {
            console.warn('no valid keywordsConfig found for components.cdoc-keywords.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                blacklist: []
            };
        }
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.blacklist = componentConfig.blacklist;
        this.keywordsConfig = componentConfig.keywordsConfig;
        this.possiblePrefixes = componentConfig.possiblePrefixes;
    }

    protected updateData() {
        this.cd.markForCheck();
    }
}
