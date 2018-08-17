import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StructuredKeyword, StructuredKeywordState} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

export interface CDocKeywordsStateComponentConfig {
    prefix: string;
    keywordsConfig: StructuredKeyword[];
    possiblePrefixes: string[];
}

@Component({
    selector: 'app-cdoc-keywordsstate',
    templateUrl: './cdoc-keywordsstate.component.html',
    styleUrls: ['./cdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CDocKeywordsStateComponent extends AbstractInlineComponent implements OnInit {
    possiblePrefixes = [];
    keywordsConfig: StructuredKeyword[] = [];
    prefix = '';

    @Input()
    public keywords: string;

    @Input()
    public suggestions?: string[] = [];

    @Output()
    public unsetKeyword: EventEmitter<string> = new EventEmitter();

    @Output()
    public setKeyword: EventEmitter<string> = new EventEmitter();

    @Output()
    public tagsFound: EventEmitter<StructuredKeywordState[]> = new EventEmitter();

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

    doSetKeyword(keyword: string): void {
        this.setKeyword.emit(keyword);
    }

    doUnsetKeyword(keyword: string): void {
        this.unsetKeyword.emit(keyword);
    }

    protected getComponentConfig(config: {}): CDocKeywordsStateComponentConfig {
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.cdoc-keywords.possiblePrefixes'),
                prefix: BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix') || ''
            };
        } else {
            console.warn('no valid keywordsConfig found for components.cdoc-keywords.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                prefix: ''
            };
        }
    }

    protected configureComponent(config: {}): void {
        const componentConfig = this.getComponentConfig(config);

        this.prefix = componentConfig.prefix;
        this.keywordsConfig = componentConfig.keywordsConfig;
        this.possiblePrefixes = componentConfig.possiblePrefixes;
    }

    protected updateData() {
        this.cd.markForCheck();
    }
}
