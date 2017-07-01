import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';

@Component({
    selector: 'app-sdoc-editpage',
    templateUrl: './sdoc-editpage.component.html',
    styleUrls: ['./sdoc-editpage.component.css']
})
export class SDocEditpageComponent implements OnInit, OnDestroy {
    public record: SDocRecord;

    constructor(private route: ActivatedRoute,
                private sdocDataService: SDocDataService, private sdocRoutingService: SDocRoutingService,
                private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.route.data.subscribe(
            (data: { record: SDocRecord }) => {
                me.record = data.record;
            },
            (error: {reason: any}) => {
                me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                console.error('edit getById failed:' + error.reason);
            }
        );
    }

    ngOnDestroy() {
    }

    submitSave(values: {}) {
        const me = this;

        this.sdocDataService.updateById(values['id'], values).then(function doneUpdateById(sdoc: SDocRecord) {
                me.sdocRoutingService.navigateBackToFrom(me.route);
            },
            function errorCreate(reason: any) {
                console.error('edit updateById failed:' + reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oops!');
            }
        );
        return false;
    }
}
