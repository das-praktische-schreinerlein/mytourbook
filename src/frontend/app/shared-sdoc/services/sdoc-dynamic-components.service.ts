import {Injectable} from '@angular/core';
import {SDocListActionsComponent} from '../components/sdoc-listactions/sdoc-listactions.component';

@Injectable()
export class DynamicComponentService  {
    getComponent(componentName: string) {
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
