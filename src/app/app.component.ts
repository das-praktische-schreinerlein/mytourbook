import {Component, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from './services/app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: []
})
@Injectable()
export class AppComponent {
    title = 'MyTourBook';

    constructor(private router: Router, private appService: AppService) {
        appService.initApp();
    }
}
