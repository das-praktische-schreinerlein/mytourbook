import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PDocListComponent} from './components/pdoc-list/pdoc-list.component';
import {PDocListItemComponent} from './components/pdoc-list-item/pdoc-list-item.component';
import {PDocListItemFlatComponent} from './components/pdoc-list-item-flat/pdoc-list-item-flat.component';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {ToastModule} from 'ng2-toastr';

@NgModule({
    declarations: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent
    ],
    imports: [
        ToastModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        AngularCommonsModule
    ],
    providers: [
    ],
    exports: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent
    ]
})
export class SharedPDocModule {}
