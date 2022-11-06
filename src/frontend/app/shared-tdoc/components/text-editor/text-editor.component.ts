import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';

export interface SingleEditorCommand {
    label: string,
    command: string
}

export interface RangeEditorCommand {
    label: string,
    commandStart: string,
    commandEnd: string
}

export interface CommonDocEditorCommandComponentConfig {
    singleCommands: SingleEditorCommand[];
    rangeCommands: RangeEditorCommand[];
}

@Component({
    selector: 'app-text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextEditorComponent extends AbstractInlineComponent {
    private flgDescRendered = false;

    public editFormGroup: FormGroup = this.fb.group({
        descTxt: '',
        descTxtRecommended: '',
    });

    @Input()
    public editorCommands: CommonDocEditorCommandComponentConfig = {
        singleCommands: [],
        rangeCommands: []
    };


    @Input()
    public descTxt = '';

    @Input()
    public descTxtRecommended = '';

    @Input()
    public recommendAvailable ? = false;

    @Output()
    public recommendDesc: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public changeDesc: EventEmitter<string> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef,
                public fb: FormBuilder,
                protected angularMarkdownService: AngularMarkdownService,
                protected platformService: PlatformService,
    ) {
        super(cd);
    }

    onCallRecommendDesc(): boolean {
       this.recommendDesc.emit(true);
       return false;
    }

    onInputChanged(value: any, field: string): boolean {
        if (field === 'descTxt') {
            this.changeDesc.emit(value);
        }

        return false;
    }

    useRecommendedDesc(): void {
        const descTxtRecommended = this.editFormGroup.getRawValue()['descTxtRecommended'] || '';
        this.setValue('descTxt', descTxtRecommended);
        this.onInputChanged(descTxtRecommended, 'descTxt');

        this.setValue('descTxtRecommended', undefined);
        this.renderDesc(true);
    }

    addSingleCommand(command: SingleEditorCommand): void {
        if (!this.platformService.isClient()) {
            return;
        }

        const textarea = <HTMLTextAreaElement> document.querySelector('#descTxt');
        if (!textarea || textarea === undefined || textarea === null) {
            return;
        }

        const oldString = textarea.value;
        const startPos = textarea.selectionStart || 0;

        const newString = oldString.substring(0, startPos)
            + command.command
            + oldString.substring(startPos, oldString.length);

        this.setValue('descTxt', newString);
        this.renderDesc(true);

        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = startPos;
    }

    addRangeCommand(command: RangeEditorCommand): void {
        if (!this.platformService.isClient()) {
            return;
        }

        const textarea = <HTMLTextAreaElement> document.querySelector('#descTxt');
        if (!textarea || textarea === undefined || textarea === null) {
            return;
        }

        const oldString = textarea.value;
        const startPos = textarea.selectionStart || 0;
        const endPos = textarea.selectionEnd || 0;

        const newString = oldString.substring(0, startPos)
            + command.commandStart
            + oldString.substring(startPos, endPos)
            +  command.commandEnd
            + oldString.substring(endPos, oldString.length);

        this.setValue('descTxt', newString);
        this.renderDesc(true);

        textarea.focus();
        textarea.selectionStart = startPos;
        textarea.selectionEnd = startPos;
    }

    renderDesc(force: boolean): string {
        if (this.flgDescRendered && !force) {
            return;
        }

        const desc = this.editFormGroup.getRawValue()['descTxt'] || '';
        if (!this.platformService.isClient()) {
            return desc;
        }

        this.flgDescRendered = this.angularMarkdownService.renderMarkdown('#renderedDesc', desc, true);

        return '';
    }

    protected updateData(): void {
        this.setValue('descTxtRecommended', this.descTxtRecommended);
        this.setValue('descTxt', this.descTxt);
    }

    setValue(field: string, value: any): void {
        const config = {};
        config[field] = value;
        this.editFormGroup.patchValue(config);
    }

}
