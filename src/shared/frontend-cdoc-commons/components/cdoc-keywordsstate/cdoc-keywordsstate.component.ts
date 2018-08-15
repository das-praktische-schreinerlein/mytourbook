import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StructuredKeyword, StructuredKeywordState} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../commons/services/generic-app.service';
import {BeanUtils} from '../../../commons/utils/bean.utils';
import {AbstractInlineComponent} from '../../../angular-commons/components/inline.component';

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
            }
        });
    }

    doSetKeyword(keyword: string): void {
        this.setKeyword.emit(keyword);
    }

    doUnsetKeyword(keyword: string): void {
        this.unsetKeyword.emit(keyword);
    }

    protected configureComponent(config: {}): void {
        if (BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords')) {
            this.keywordsConfig = BeanUtils.getValue(config, 'components.cdoc-keywords.structuredKeywords');
            this.possiblePrefixes = BeanUtils.getValue(config, 'components.cdoc-keywords.possiblePrefixes');
            this.prefix = BeanUtils.getValue(config, 'components.cdoc-keywords.editPrefix') || '';
            this.updateData();
        } else {
            console.warn('no valid keywordsConfig found');
            this.keywordsConfig = [];
            this.possiblePrefixes = [];
            this.prefix = '';
        }
    }

    protected updateData() {
        this.cd.markForCheck();
    }
}
