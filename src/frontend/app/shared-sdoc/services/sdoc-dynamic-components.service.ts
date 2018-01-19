import {ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {SDocListActionsComponent} from '../components/sdoc-listactions/sdoc-listactions.component';
import {DynamicComponentService} from '../../../shared/angular-commons/services/dynamic-components.service';

@Injectable()
export class SDocDynamicComponentService extends DynamicComponentService {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver);
    }

    public getComponent(componentName: string): Type<any> {
        switch (componentName) {
            case 'listActions':
            case 'listActionsSmall':
            case 'listActionsBig':
            case 'listActionsFlat':
              return SDocListActionsComponent;
        }

        return null;
    }
}
