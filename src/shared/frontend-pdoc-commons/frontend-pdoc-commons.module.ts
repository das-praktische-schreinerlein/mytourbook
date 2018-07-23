import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularCommonsModule} from '../angular-commons/angular-commons.module';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PDocListItemFlatComponent} from './components/pdoc-list-item-flat/pdoc-list-item-flat.component';
import {PDocListComponent} from './components/pdoc-list/pdoc-list.component';
import {PDocListItemComponent} from './components/pdoc-list-item/pdoc-list-item.component';

@NgModule({
    declarations: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent
    ],
    imports: [
        NgbModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AngularCommonsModule
    ],
    exports: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent
    ]
})
export class FrontendPDocCommonsModule {
}
