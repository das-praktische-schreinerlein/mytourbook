import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChange, ViewChild,
    ViewContainerRef
} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {DynamicComponentHostDirective} from '../../../../shared/angular-commons/components/directives/dynamic-component-host.directive';
import {ComponentUtils} from '../../../../shared/angular-commons/services/component.utils';
import {ActionTagEvent} from '../sdoc-actiontags/sdoc-actiontags.component';
import {Router} from '@angular/router';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ToastsManager} from 'ng2-toastr';
import {ActionTagForm} from '../../../../shared/commons/utils/actiontag.utils';

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

    private childActionTagEvent: EventEmitter<ActionTagEvent> = new EventEmitter();

    constructor(private dynamicComponentService: SDocDynamicComponentService, private router: Router,
                private sdocDataService: SDocDataService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
        const me = this;
        this.childActionTagEvent.asObservable().subscribe(actionTagEvent => {
            if (actionTagEvent.config.key === 'edit') {
                actionTagEvent.processed = true;
                actionTagEvent.error = undefined;
                this.actionTagEvent.emit(actionTagEvent);
                this.router.navigate([ 'sdocadmin', 'edit', 'anonym', actionTagEvent.record.id ] );
            } else if (actionTagEvent.config.key === 'createBy') {
                const payload = JSON.parse(JSON.stringify(actionTagEvent.config.payload));
                actionTagEvent.processed = true;
                actionTagEvent.error = undefined;
                this.actionTagEvent.emit(actionTagEvent);
                this.router.navigate([ 'sdocadmin', 'create', payload.type, actionTagEvent.record.id ] );
            } else if (actionTagEvent.config.type === 'tag') {
                const payload = JSON.parse(JSON.stringify(actionTagEvent.config.payload));
                payload['set'] = actionTagEvent.set;
                payload['name'] = actionTagEvent.config.name;
                const actinTagForm: ActionTagForm = {
                    key: actionTagEvent.config.key,
                    payload: payload,
                    recordId: actionTagEvent.record.id,
                    type: actionTagEvent.config.type
                };
                sdocDataService.doActionTag(<SDocRecord>actionTagEvent.record, actinTagForm).then(sdoc => {
                    actionTagEvent.processed = true;
                    actionTagEvent.error = undefined;
                    actionTagEvent.result = sdoc;
                    me.actionTagEvent.emit(actionTagEvent);
                }).catch(reason => {
                    actionTagEvent.processed = true;
                    actionTagEvent.error = reason;
                    me.actionTagEvent.emit(actionTagEvent);
                    me.toastr.error('Es gibt leider Probleme - am besten noch einmal probieren :-(', 'Oje!');
                    console.error('sdocactions failed:', reason);
                });
            } else {
                this.actionTagEvent.emit(actionTagEvent);
            }
        });
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderComponents();
        }
    }

    renderComponents() {
        const componentRef = this.dynamicComponentService.createComponentByName(this.type, this.widgetHost);
        (componentRef.instance)['type'] = this.type;
        (componentRef.instance)['actionTagEvent'] = this.childActionTagEvent;
        (componentRef.instance)['record'] = this.record;
    }

}
