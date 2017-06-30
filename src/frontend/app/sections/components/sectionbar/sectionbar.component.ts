import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '../../../../shared/pdoc-commons/model/records/pdoc-record';
import {ToastsManager} from 'ng2-toastr';

@Component({
    selector: 'app-sectionbar',
    templateUrl: './sectionbar.component.html',
    styleUrls: ['./sectionbar.component.css']
})
export class SectionBarComponent implements OnInit {
    pdoc: PDocRecord;

    constructor(private route: ActivatedRoute,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { pdoc: PDocRecord }) => {
                me.pdoc = data.pdoc;
            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('show getById failed:' + error.reason);
            }
        );
    }

}
