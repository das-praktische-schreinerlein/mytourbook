import {Component, Inject, Injectable, LOCALE_ID, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AppService, AppState} from './services/app.service';
import {ToastsManager} from 'ng2-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})
@Injectable()
export class AppComponent {
    title = 'MyTourBook';

    constructor(private router: Router, private appService: AppService, private toastr: ToastsManager, vcr: ViewContainerRef,
                translate: TranslateService, @Inject(LOCALE_ID) locale: string) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(locale);

        this.toastr.setRootViewContainerRef(vcr);

        appService.getAppState().subscribe(
            appState => {
                if (appState === AppState.Ready) {
                    this.toastr.info('App wurde initialisiert. Viel Spaß :-)', 'Fertig');
                } else if (appState === AppState.Failed) {
                    this.toastr.error('Es gibt leider Probleme bei Initialiseren der App - am besten noch einmal probieren :-(', 'Oops!');
                }
            }
        );

        appService.initApp();
    }
}
