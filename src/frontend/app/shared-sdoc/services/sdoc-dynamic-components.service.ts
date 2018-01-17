import {Injectable} from '@angular/core';
import {SDocListActionsComponent} from '../components/sdoc-listactions/sdoc-listactions.component';

@Injectable()
export class DynamicComponentService  {
    getComponent(componentName: string) {
        if (componentName === 'listActions') {
            return SDocListActionsComponent;
        }

        return null;
    }
}
