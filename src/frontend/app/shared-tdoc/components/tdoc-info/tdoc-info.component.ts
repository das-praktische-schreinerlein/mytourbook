import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {SafeHtml} from '@angular/platform-browser';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {TourDocInfoRecordType} from '../../../../shared/tdoc-commons/model/records/tdocinfo-record';

@Component({
    selector: 'app-tdoc-info',
    templateUrl: './tdoc-info.component.html',
    styleUrls: ['./tdoc-info.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocInfoComponent extends AbstractInlineComponent {
    tdocinfo: TourDocInfoRecordType;
    guides: SafeHtml = '';

    @Input()
    public record: TourDocRecord;

    @Input()
    public small? = false;

    constructor(protected cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
        if (this.record === undefined) {
            this.tdocinfo = undefined;
            return;
        }
        this.tdocinfo = this.record['tdocinfo'];
    }
}
