import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewChild} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {DynamicComponentHostDirective} from '../../../../shared/angular-commons/components/directives/dynamic-component-host.directive';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ActionTagEvent} from '../sdoc-actiontags/sdoc-actiontags.component';

@Component({
    selector: 'app-sdoc-action',
    templateUrl: './sdoc-actions.component.html',
    styleUrls: ['./sdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocActionsComponent implements OnChanges {

    @Input()
    public record: SDocRecord;

    @Input()
    public type: string;

    @Output()
    public actionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    @ViewChild(DynamicComponentHostDirective)
    widgetHost: DynamicComponentHostDirective;

    constructor(private dynamicComponentService: SDocDynamicComponentService ) {
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderComponents();
        }
    }

    renderComponents() {
        const componentRef = this.dynamicComponentService.createComponentByName(this.type, this.widgetHost);
        (componentRef.instance)['type'] = this.type;
        (componentRef.instance)['actionTagEvent'] = this.actionTagEvent;
        (componentRef.instance)['record'] = this.record;
    }
}
