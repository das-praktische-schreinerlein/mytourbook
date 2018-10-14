import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonRoutingService, RoutingState} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

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
    showLaw = false;
    cookieLawSeenName = environment.cookieLawSeenName;

    constructor(private appService: GenericAppService, private toastr: ToastrService,
                translate: TranslateService, private router: Router, @Inject(LOCALE_ID) locale: string,
                private http: HttpClient, private commonRoutingService: CommonRoutingService, private cd: ChangeDetectorRef,
                private platformService: PlatformService, private pageUtils: PageUtils, private layoutService: LayoutService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang(locale);

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(locale);

        this.showInitState();

        if (this.platformService.isClient()) {
            this.showLaw = true;
        }

        // load overrides
        const url = this.platformService.getAssetsUrl(
            `./assets/locales/locale-${locale}-overrides` + environment.assetsPathVersionSnippet + `.json` +
            environment.assetsPathVersionSuffix);
        // console.log('load locale-override', url);
        this.http.get(url).toPromise()
            .then(function onDocsLoaded(res: any) {
                const i18n: any[] = res;
                translate.setTranslation(locale, i18n, true);
                appService.initApp();
            }).catch(function onError(reason: any) {
                console.error('loading locale-overrides failed:' + LogUtils.sanitizeLogMsg(url), reason);
                appService.initApp();
            });

        this.doBrowserCheck();
    }

    private showInitState() {
        this.appService.getAppState().subscribe(
            appState => {
                if (appState === AppState.Ready && this.platformService.isClient()) {
                    this.toastr.info('App wurde initialisiert. Viel Spaß :-)', 'Fertig');
                } else if (appState === AppState.Failed) {
                    this.router.navigateByUrl('errorpage');
                }
            }
        );

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

    private doBrowserCheck() {
        // check ie
        const browser = this.layoutService.getBrowser();
        switch (browser && browser['name']) {
            case 'ie':
                this.toastr.warning('<h4>Auweia</h4>\n' +
                    'Dieser Browser ist leider etwas "..." und wird die Seite wahrscheinlich nicht richtig darstellen können :-(<br />\n' +
                    'Am besten du probierst es mal mit dem neusten Chrome, Firefox, Edge oder Safari. Die sind getestet :-)', 'AuWaia',
                    { positionClass: 'toast-top-full-width', timeOut: 99999999, closeButton: true, tapToDismiss: true,
                        enableHtml: true});
                this.pageUtils.setGlobalStyle('.flg-browser-not-compatible { display: none !important; } ', 'browserCompatible');
                break;

            default:
        }
    }
}
