import {ComponentFactoryResolver, ComponentRef, Injectable, Type} from '@angular/core';
import {DynamicComponentHostDirective} from '../components/directives/dynamic-component-host.directive';

@Injectable()
export class DynamicComponentService  {
    constructor(private _componentFactoryResolver: ComponentFactoryResolver) {
    }

    public createComponent(component: Type<any>, widgetHost: DynamicComponentHostDirective): ComponentRef<any> {
        if (component === null || component === undefined) {
            return undefined;
        }

        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);
        const viewContainerRef = widgetHost.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);

        return componentRef;
    }

    public createComponentByName(type: string, widgetHost: DynamicComponentHostDirective): ComponentRef<any> {
        const componentRef = this.createComponent(this.getComponent(type), widgetHost);
        if (componentRef === null || componentRef === undefined) {
            return undefined;
        }

        (componentRef.instance)['type'] = type;

        return componentRef;
    }

    public getComponent(componentName: string): Type<any> {
        return null;
    }
}
