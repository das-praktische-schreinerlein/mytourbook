import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {AppRoutingModule} from './app.router';
import {TourDocAdminModule} from './tdoc-admin/tdoc-admin.module';
import {
    TourDocObjectDetectionObjectKeyEditFormComponent
} from './shared-admin-tdoc/components/tdoc-odobjectkeyeditform/tdoc-odobjectkeyeditform.component';
import {TourDocReplaceFormComponent} from './shared-admin-tdoc/components/tdoc-replaceform/tdoc-replaceform.component';
import {TourDocAssignFormComponent} from './shared-admin-tdoc/components/tdoc-assignform/tdoc-assignform.component';
import {TourDocAssignJoinFormComponent} from './shared-admin-tdoc/components/tdoc-assignjoinform/tdoc-assignjoinform.component';
import {TourDocNameSuggesterService} from './shared-admin-tdoc/services/tdoc-name-suggester.service';
import {TourDocDescSuggesterService} from './shared-admin-tdoc/services/tdoc-desc-suggester.service';
import {TourDocTripDescSuggesterService} from './shared-admin-tdoc/services/tdoc-trip-desc-suggester.service';
import {TourDocLocationDescSuggesterService} from './shared-admin-tdoc/services/tdoc-location-desc-suggester.service';
import {TourDocNewsDescSuggesterService} from './shared-admin-tdoc/services/tdoc-news-desc-suggester.service';
import {TourDocRouteDescSuggesterService} from './shared-admin-tdoc/services/tdoc-route-desc-suggester.service';
import {TourDocTrackDescSuggesterService} from './shared-admin-tdoc/services/tdoc-track-desc-suggester.service';
import {TourDocAssignPlaylistFormComponent} from './shared-admin-tdoc/components/tdoc-assignplaylistform/tdoc-assignplaylistform.component';
import {AppCommonModule} from './app.common.module';
import {SharedAdminTourDocModule} from './shared-admin-tdoc/shared-admin-tdoc.module';
import {TourDocActionTagService} from './shared-tdoc/services/tdoc-actiontag.service';
import {TourDocAdminActionTagService} from './shared-admin-tdoc/services/tdoc-admin-actiontag.service';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@NgModule({
    entryComponents: [
        TourDocObjectDetectionObjectKeyEditFormComponent,
        TourDocReplaceFormComponent,
        TourDocAssignFormComponent,
        TourDocAssignJoinFormComponent,
        TourDocAssignPlaylistFormComponent
    ],
    imports: [
        AppCommonModule,
        SharedAdminTourDocModule,
        TourDocAdminModule,
        AppRoutingModule
    ],
    providers: [
        {provide: TourDocActionTagService, useClass: TourDocAdminActionTagService},
        TourDocNameSuggesterService,
        TourDocDescSuggesterService,
        TourDocLocationDescSuggesterService,
        TourDocNewsDescSuggesterService,
        TourDocRouteDescSuggesterService,
        TourDocTrackDescSuggesterService,
        TourDocTripDescSuggesterService
    ],
    // Since the bootstrapped component is not inherited from your
    // imported AppModule, it needs to be repeated here.
    bootstrap: [AppComponent]
})
export class AppModule {}
