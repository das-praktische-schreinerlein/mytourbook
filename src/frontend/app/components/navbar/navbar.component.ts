import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';
import {PDocDataService} from '../../../shared/pdoc-commons/services/pdoc-data.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    sections: PDocRecord[];

    constructor(private route: ActivatedRoute, private toastr: ToastsManager, vcr: ViewContainerRef,
                private pdocDataService: PDocDataService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdocs: PDocRecord[] }) => {
                me.sections = [];
                this.pdocDataService.getById('sections', {forceLocalStore: true}).then(function onThemesFound(pdoc: PDocRecord) {
                    me.sections = me.getSubSections(pdoc);
                    }
                ).catch(function onNotFound(error) {
                    console.error('show getSection failed:', error);
                    }
                );
            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('show getSections failed:' + error.reason);
            }
        );
    }

    getSubSections(pdoc: PDocRecord): PDocRecord[] {
        return this.pdocDataService.getSubDocuments(pdoc);
    }
}
