import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {PDocEditformComponent} from './components/pdoc-editform/pdoc-editform.component';
import {AngularMapsModule} from '@dps/mycms-frontend-commons/dist/angular-maps/angular-maps.module';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {ToastrModule} from 'ngx-toastr';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {PDocReplaceFormComponent} from './components/pdoc-replaceform/pdoc-replaceform.component';
import {PDocAssignFormComponent} from './components/pdoc-assignform/pdoc-assignform.component';
import {RouterModule} from '@angular/router';
import {PDocSelectSearchComponent} from './components/pdoc-selectsearch/pdoc-selectsearch.component';
import {PDocAssignJoinFormComponent} from './components/pdoc-assignjoinform/pdoc-assignjoinform.component';
import {SharedPDocModule} from '../shared-pdoc/shared-pdoc.module';

@NgModule({
    declarations: [
        PDocEditformComponent,
        PDocReplaceFormComponent,
        PDocAssignFormComponent,
        PDocAssignJoinFormComponent,
        PDocSelectSearchComponent
    ],
    imports: [
        SharedPDocModule,
        ToastrModule,
        MultiselectDropdownModule,
        TranslateModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AngularCommonsModule,
        AngularMapsModule,
        FrontendCommonDocCommonsModule,
        RouterModule
    ],
    exports: [
        PDocEditformComponent,
        PDocReplaceFormComponent,
        PDocAssignFormComponent,
        PDocAssignJoinFormComponent,
        PDocSelectSearchComponent
    ]
})
export class SharedAdminPDocModule {}
