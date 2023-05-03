import {ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {DynamicComponentService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/dynamic-components.service';
import {PDocActionTagsComponent} from '../components/pdoc-actiontags/pdoc-actiontags.component';

@Injectable()
export class PDocDynamicComponentService extends DynamicComponentService {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver);
    }

    public getComponent(componentName: string): Type<any> {
        switch (componentName) {
            case 'actionTags':
            case 'actionTagsSmall':
            case 'actionTagsBig':
            case 'actionTagsFlat':
              return PDocActionTagsComponent;
        }

        return null;
    }
}
