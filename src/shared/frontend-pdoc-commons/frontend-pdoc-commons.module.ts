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
import {SectionBarComponent} from './components/sectionbar/sectionbar.component';
import {SectionComponent} from './components/section/section.component';
import {RouterModule} from '@angular/router';
import {SectionPageComponent} from './components/sectionpage/section-page.component';

@NgModule({
    declarations: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent,
        SectionComponent,
        SectionBarComponent,
        SectionPageComponent
    ],
    imports: [
        NgbModule,
        MultiselectDropdownModule,
        TranslateModule,
        RouterModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AngularCommonsModule
    ],
    exports: [
        PDocListComponent,
        PDocListItemComponent,
        PDocListItemFlatComponent,
        SectionComponent,
        SectionBarComponent,
        SectionPageComponent
    ]
})
export class FrontendPDocCommonsModule {
}
