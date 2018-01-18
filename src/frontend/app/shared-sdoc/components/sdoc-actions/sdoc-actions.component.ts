import {
    ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChange,
    ViewChild
} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {DynamicComponentHostDirective} from '../../directives/dynamic-component-host.directive';
import {ComponentUtils} from '../../../../../shared/angular-commons/services/component.utils';

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

    @ViewChild(DynamicComponentHostDirective) widgetHost: DynamicComponentHostDirective;
    constructor(private _componentFactoryResolver: ComponentFactoryResolver, private dynamicComponentService: DynamicComponentService ) {

    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        if (ComponentUtils.hasNgChanged(changes)) {
            this.renderComponents();
        }
    }

    renderComponents() {
        const component: any = this.dynamicComponentService.getComponent(this.type);
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance)['record'] = this.record;
        (componentRef.instance)['type'] = this.type;
    }}
