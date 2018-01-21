import {ComponentFactoryResolver, Injectable, Type} from '@angular/core';
import {DynamicComponentService} from '../../../shared/angular-commons/services/dynamic-components.service';
import {SDocActionTagsComponent} from '../components/sdoc-actiontags/sdoc-actiontags.component';

@Injectable()
export class SDocDynamicComponentService extends DynamicComponentService {
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        super(componentFactoryResolver);
    }

    public getComponent(componentName: string): Type<any> {
        switch (componentName) {
            case 'actionTags':
            case 'actionTagsSmall':
            case 'actionTagsBig':
            case 'actionTagsFlat':
              return SDocActionTagsComponent;
        }

        return null;
    }
}
