import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';

@Component({
    selector: 'app-pdoc-info',
    templateUrl: './pdoc-info.component.html',
    styleUrls: ['./pdoc-info.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdocInfoComponent extends AbstractInlineComponent {
    langkeys = [];
    profiles = [];
    flags = [];

    @Input()
    public record: PDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.langkeys = [];
            this.profiles = [];
            this.flags = [];
        }

        this.langkeys = this.record.langkeys ?
            this.record.langkeys.replace(/ /gs, '')
                .split(',')
            : [];
        this.profiles = this.record.profiles ?
            this.record.profiles.replace(/ /gs, '')
                .split(',')
            : [];
        this.flags = this.record.flags ?
            this.record.flags.replace(/ /gs, '')
                .split(',')
            : [];
    }
}
