import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injectable, LOCALE_ID, ViewContainerRef} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AppState, GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {CommonRoutingService, RoutingState} from '../../../shared/angular-commons/services/common-routing.service';
import {AssetsService} from '../../../shared/angular-commons/services/assets.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent {
    showLoadingSpinner = true;
    title = 'MyTourBook';

    constructor(private appService: GenericAppService, private toastr: ToastsManager, vcr: ViewContainerRef,
                translate: TranslateService, private router: Router, @Inject(LOCALE_ID) locale: string,
                private http: Http, private commonRoutingService: CommonRoutingService, private cd: ChangeDetectorRef,
                private assetsService: AssetsService) {
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
                    this.router.navigateByUrl('errorpage');
                }
            }
        );

        // load overrides
        const url = this.assetsService.getAssetsUrl(`./assets/locales/locale-${locale}-overrides.json`);
        console.log('load locale-override', url);
        this.http.request(url).toPromise()
            .then(function onDocsLoaded(res: any) {
                const i18n: any[] = res.json();
                translate.setTranslation(locale, i18n, true);
                appService.initApp();
            }).catch(function onError(reason: any) {
                console.error('loading locale-overrides failed:' + url, reason);
                appService.initApp();
            });

        this.commonRoutingService.getRoutingState().subscribe(
            routingState => {
                if (routingState === RoutingState.RUNNING) {
                    this.showLoadingSpinner = true;
                } else {
                    this.showLoadingSpinner = false;
                }
                this.cd.markForCheck();
            }
        );
    }
}
