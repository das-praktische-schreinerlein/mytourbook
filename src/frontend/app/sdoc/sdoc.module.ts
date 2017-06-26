import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {SDocListComponent} from './components/sdoc-list/sdoc-list.component';
import {SDocListItemComponent} from './components/sdoc-list-item/sdoc-list-item.component';
import {SDocListFooterComponent} from './components/sdoc-list-footer/sdoc-list-footer.component';
import {SDocEditformComponent} from './components/sdoc-editform/sdoc-editform.component';
import {SDocSearchformComponent} from './components/sdoc-searchform/sdoc-searchform.component';
import {SDocSearchpageComponent} from './components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from './components/sdoc-editpage/sdoc-editpage.component';
import {SDocCreateformComponent} from './components/sdoc-createform/sdoc-createform.component';
import {SDocCreatepageComponent} from './components/sdoc-createpage/sdoc-createpage.component';
import {SDocListHeaderComponent} from './components/sdoc-list-header/sdoc-list-header.component';
import {SDocSearchFormConverter} from './services/sdoc-searchform-converter.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SDocShowpageComponent} from './components/sdoc-showpage/sdoc-showpage.component';
import {SDocRoutingService} from './services/sdoc-routing.service';
import {SDocInlineSearchpageComponent} from './components/sdoc-inline-searchpage/sdoc-inline-searchpage.component';
import {SDocListItemSmallComponent} from './components/sdoc-list-item-small/sdoc-list-item-small.component';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {SDocSearchFormUtils} from './services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from './resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from './resolver/sdoc-details.resolver';
import {SDocRoutingModule} from './sdoc-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {ToastModule} from 'ng2-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AngularCommonsModule} from '../../shared/angular-commons/angular-commons.module';
import {SearchParameterUtils} from '../../shared/search-commons/services/searchparameter.utils';

@NgModule({
    declarations: [
        SDocListComponent,
        SDocListItemComponent,
        SDocListItemSmallComponent,
        SDocListHeaderComponent,
        SDocListFooterComponent,
        SDocEditformComponent,
        SDocCreateformComponent,
        SDocSearchformComponent,
        SDocSearchpageComponent,
        SDocCreatepageComponent,
        SDocEditpageComponent,
        SDocShowpageComponent,
        SDocInlineSearchpageComponent
    ],
    imports: [
        NgbModule,
        ToastModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        JsonpModule,
        AngularCommonsModule,
        SDocRoutingModule
    ],
    providers: [
        SDocSearchFormConverter,
        SDocRoutingService,
        SDocSearchFormUtils,
        SearchParameterUtils,
        SDocSearchFormResolver,
        SDocRecordResolver
    ]
})
export class SDocModule {}
