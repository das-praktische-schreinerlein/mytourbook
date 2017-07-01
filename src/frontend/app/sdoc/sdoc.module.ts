import {NgModule} from '@angular/core';
import {HttpModule, JsonpModule} from '@angular/http';
import {SDocSearchpageComponent} from './components/sdoc-searchpage/sdoc-searchpage.component';
import {SDocEditpageComponent} from '../admin/components/sdoc-editpage/sdoc-editpage.component';
import {SDocCreatepageComponent} from '../admin/components/sdoc-createpage/sdoc-createpage.component';
import {SDocSearchFormConverter} from '../shared-sdoc/services/sdoc-searchform-converter.service';
import {SDocShowpageComponent} from './components/sdoc-showpage/sdoc-showpage.component';
import {SDocRoutingService} from '../shared-sdoc/services/sdoc-routing.service';
import {SDocSearchFormUtils} from '../shared-sdoc/services/sdoc-searchform-utils.service';
import {SDocSearchFormResolver} from '../shared-sdoc/resolver/sdoc-searchform.resolver';
import {SDocRecordResolver} from '../shared-sdoc/resolver/sdoc-details.resolver';
import {SDocRoutingModule} from './sdoc-routing.module';
import {ToastModule} from 'ng2-toastr';
import {SearchParameterUtils} from '../../shared/search-commons/services/searchparameter.utils';
import {SDocContentUtils} from '../shared-sdoc/services/sdoc-contentutils.service';
import {SharedSDocModule} from '../shared-sdoc/shared-sdoc.module';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
    declarations: [
        SDocSearchpageComponent,
        SDocCreatepageComponent,
        SDocEditpageComponent,
        SDocShowpageComponent,
    ],
    imports: [
        BrowserModule,
        ToastModule,
        HttpModule,
        JsonpModule,
        SharedSDocModule,
        SDocRoutingModule
    ],
    providers: [
        SDocSearchFormConverter,
        SDocRoutingService,
        SDocSearchFormUtils,
        SearchParameterUtils,
        SDocContentUtils,
        SDocSearchFormResolver,
        SDocRecordResolver
    ],
    exports: [
        SDocSearchpageComponent
    ]
})
export class SDocModule {}
