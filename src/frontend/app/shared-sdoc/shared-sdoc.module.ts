import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SDocListComponent} from './components/sdoc-list/sdoc-list.component';
import {SDocListItemComponent} from './components/sdoc-list-item/sdoc-list-item.component';
import {SDocListFooterComponent} from './components/sdoc-list-footer/sdoc-list-footer.component';
import {SDocEditformComponent} from './components/sdoc-editform/sdoc-editform.component';
import {SDocSearchformComponent} from './components/sdoc-searchform/sdoc-searchform.component';
import {SDocCreateformComponent} from './components/sdoc-createform/sdoc-createform.component';
import {SDocListHeaderComponent} from './components/sdoc-list-header/sdoc-list-header.component';
import {SDocInlineSearchpageComponent} from './components/sdoc-inline-searchpage/sdoc-inline-searchpage.component';
import {SDocListItemSmallComponent} from './components/sdoc-list-item-small/sdoc-list-item-small.component';
import {SDocListItemFlatComponent} from './components/sdoc-list-item-flat/sdoc-list-item-flat.component';
import {AngularMapsModule} from '../../shared/angular-maps/angular-maps.module';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {HttpModule, JsonpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastModule} from 'ng2-toastr';
import {SDocProfileMapComponent} from './components/sdoc-profilemap/sdoc-profilemap.component';
import {SDocMapComponent} from './components/sdoc-map/sdoc-map.component';
import {SDocLinkedLocHierarchyComponent} from './components/sdoc-linked-loc-hierarchy/sdoc-linked-loc-hierarchy.component';
import {SDocRateTechComponent} from './components/sdoc-ratetech/sdoc-ratetech.component';
import {SDocDataTechComponent} from './components/sdoc-datatech/sdoc-datatech.component';
import {SDocRatePersonalComponent} from './components/sdoc-ratepers/sdoc-ratepers.component';
import {SDocListItemPageComponent} from './components/sdoc-list-item-page/sdoc-list-item-page.component';
import {SDocTimetableComponent} from './components/sdoc-timetable/sdoc-timetable.component';

@NgModule({
    declarations: [
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListItemFlatComponent,
        SDocListItemPageComponent,
        SDocListHeaderComponent,
        SDocListFooterComponent,
        SDocEditformComponent,
        SDocCreateformComponent,
        SDocSearchformComponent,
        SDocInlineSearchpageComponent,
        SDocMapComponent,
        SDocProfileMapComponent,
        SDocInlineSearchpageComponent,
        SDocLinkedLocHierarchyComponent,
        SDocDataTechComponent,
        SDocRatePersonalComponent,
        SDocRateTechComponent,
        SDocTimetableComponent
    ],
    imports: [
        ToastModule,
        NgbModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        AngularCommonsModule,
        AngularMapsModule,
    ],
    providers: [
    ],
    exports: [
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListItemFlatComponent,
        SDocListItemPageComponent,
        SDocListHeaderComponent,
        SDocListFooterComponent,
        SDocEditformComponent,
        SDocCreateformComponent,
        SDocSearchformComponent,
        SDocInlineSearchpageComponent,
        SDocMapComponent,
        SDocProfileMapComponent,
        SDocInlineSearchpageComponent,
        SDocLinkedLocHierarchyComponent,
        SDocDataTechComponent,
        SDocRatePersonalComponent,
        SDocRateTechComponent,
        SDocTimetableComponent
    ]
})
export class SharedSDocModule {}
