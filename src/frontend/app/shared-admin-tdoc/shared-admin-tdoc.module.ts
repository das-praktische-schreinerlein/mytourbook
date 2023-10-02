import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TourDocEditformComponent} from './components/tdoc-editform/tdoc-editform.component';
import {AngularMapsModule} from '@dps/mycms-frontend-commons/dist/angular-maps/angular-maps.module';
import {AngularMapsAdminModule} from '@dps/mycms-frontend-commons/dist/angular-maps-admin/angular-maps-admin.module';
import {AngularCommonsModule} from '@dps/mycms-frontend-commons/dist/angular-commons/angular-commons.module';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect';
import {ToastrModule} from 'ngx-toastr';
import {LightboxModule} from 'ngx-lightbox';
import {FileDropModule} from 'ngx-file-drop';
import {FrontendCommonDocCommonsModule} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/frontend-cdoc-commons.module';
import {TourDocReplaceFormComponent} from './components/tdoc-replaceform/tdoc-replaceform.component';
import {TourDocAssignFormComponent} from './components/tdoc-assignform/tdoc-assignform.component';
import {RouterModule} from '@angular/router';
import {TourDocSelectSearchComponent} from './components/tdoc-selectsearch/tdoc-selectsearch.component';
import {OdImageEditorComponent} from './components/odimage-editor/odimage-editor.component';
import {TourDocAssignPlaylistFormComponent} from './components/tdoc-assignplaylistform/tdoc-assignplaylistform.component';
import {TourDocAssignJoinFormComponent} from './components/tdoc-assignjoinform/tdoc-assignjoinform.component';
import {TourDocObjectDetectionObjectKeyEditFormComponent} from './components/tdoc-odobjectkeyeditform/tdoc-odobjectkeyeditform.component';
import {SharedTourDocModule} from '../shared-tdoc/shared-tdoc.module';

@NgModule({
    declarations: [
        TourDocEditformComponent,
        TourDocObjectDetectionObjectKeyEditFormComponent,
        TourDocReplaceFormComponent,
        TourDocAssignFormComponent,
        TourDocAssignJoinFormComponent,
        TourDocAssignPlaylistFormComponent,
        TourDocSelectSearchComponent,
        OdImageEditorComponent
    ],
    imports: [
        SharedTourDocModule,
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
        AngularMapsAdminModule,
        FrontendCommonDocCommonsModule,
        LightboxModule,
        RouterModule,
        FileDropModule
    ],
    exports: [
        TourDocEditformComponent,
        TourDocObjectDetectionObjectKeyEditFormComponent,
        TourDocReplaceFormComponent,
        TourDocAssignFormComponent,
        TourDocAssignJoinFormComponent,
        TourDocAssignPlaylistFormComponent,
        TourDocSelectSearchComponent,
        OdImageEditorComponent
    ]
})
export class SharedAdminTourDocModule {}
