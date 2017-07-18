import {Component, Injectable, OnInit} from '@angular/core';
import {PageUtils} from '../../../shared/angular-commons/services/page.utils';

@Component({
    selector: 'app-errorpage',
    templateUrl: './errorpage.component.html',
    styleUrls: ['./errorpage.component.css']
})
@Injectable()
export class ErrorPageComponent implements  OnInit {
    constructor(private pageUtils: PageUtils) {
    }

    ngOnInit() {
        this.pageUtils.setTranslatedTitle('meta.title.prefix.errorPage', {}, 'Error');
        this.pageUtils.setTranslatedDescription('meta.desc.prefix.errorPage', {}, 'Error');
        this.pageUtils.setRobots(false, false);
        this.pageUtils.setMetaLanguage();
        return;
    }
}
