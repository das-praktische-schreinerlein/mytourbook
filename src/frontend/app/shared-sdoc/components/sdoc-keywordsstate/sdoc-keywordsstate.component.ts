import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output,
    SimpleChange
} from '@angular/core';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {StructuredKeyword, StructuredKeywordState} from '../../services/cdoc-contentutils.service';
import {AppState, GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';

@Component({
    selector: 'app-sdoc-keywordsstate',
    templateUrl: './sdoc-keywordsstate.component.html',
    styleUrls: ['./sdoc-keywordsstate.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocKeywordsStateComponent implements OnInit, OnChanges {
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

    constructor(private appService: GenericAppService, private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.appService.getAppState().subscribe(appState => {
            if (appState === AppState.Ready) {
                const config = this.appService.getAppConfig();
                if (BeanUtils.getValue(config, 'components.sdoc-keywords.structuredKeywords')) {
                    this.keywordsConfig = BeanUtils.getValue(config, 'components.sdoc-keywords.structuredKeywords');
                    this.possiblePrefixes = BeanUtils.getValue(config, 'components.sdoc-keywords.possiblePrefixes');
                    this.prefix = BeanUtils.getValue(config, 'components.sdoc-keywords.editPrefix') || '';
                    this.updateData();
                } else {
                    console.warn('no valid keywordsConfig found');
                    this.keywordsConfig = [];
                    this.possiblePrefixes = [];
                    this.prefix = '';
                }
            }
        });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.updateData();
        }
    }

    doSetKeyword(keyword: string): void {
        this.setKeyword.emit(keyword);
    }

    doUnsetKeyword(keyword: string): void {
        this.unsetKeyword.emit(keyword);
    }

    private updateData() {
        this.cd.markForCheck();
    }
}
