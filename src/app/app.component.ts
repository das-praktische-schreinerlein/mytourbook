import {Component, Injectable, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {AppService, AppState} from './services/app.service';
import {ToastsManager} from 'ng2-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})
@Injectable()
export class AppComponent {
    title = 'MyTourBook';

    constructor(private router: Router, private appService: AppService, private toastr: ToastsManager, vcr: ViewContainerRef) {
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
