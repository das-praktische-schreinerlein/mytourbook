import {Component, Inject, Injectable, LOCALE_ID, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AppState, GenericAppService} from '../../../shared/search-commons/services/generic-app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})
@Injectable()
export class AppComponent {
    title = 'MyTourBook';

    constructor(private appService: GenericAppService, private toastr: ToastsManager, vcr: ViewContainerRef,
                translate: TranslateService, @Inject(LOCALE_ID) locale: string) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(locale);

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(locale);

        this.toastr.setRootViewContainerRef(vcr);

        appService.getAppState().subscribe(
            appState => {
                if (appState === AppState.Ready) {
                    this.toastr.info('App wurde initialisiert. Viel Spaß :-)', 'Fertig');
                } else if (appState === AppState.Failed) {
                    this.toastr.error('Es gibt leider Probleme bei Initialiseren der App - am besten noch einmal probieren :-(', 'Oje!');
                }
            }
        );

        appService.initApp();
    }
}
