import {Component, Injectable, OnInit} from '@angular/core';
import {BrowserOnlineState, GenericAppService} from '../../../commons/services/generic-app.service';

@Component({
    selector: 'app-browser-onoffline',
    templateUrl: './show-browseronoffline.component.html',
    styleUrls: ['./show-browseronoffline.component.css']
})
@Injectable()
export class ShowBrowserOnOfflineComponent implements OnInit {
    public onlineState = 'online';

    constructor (private appService: GenericAppService) {
    }

    ngOnInit() {
        this.appService.getBrowserOnlineState().subscribe(appOnlineState => {
            if (appOnlineState === BrowserOnlineState.Offline) {
                this.onlineState = 'offline';
            } else if (appOnlineState === BrowserOnlineState.Online) {
                this.onlineState = 'online';
            }
        });
    }
}
