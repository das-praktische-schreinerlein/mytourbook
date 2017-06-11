import {Component, OnDestroy, OnInit} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-sdoc-editpage',
    templateUrl: './sdoc-editpage.component.html',
    styleUrls: ['./sdoc-editpage.component.css']
})
export class SDocEditpageComponent implements OnInit, OnDestroy {
    private routeSubscription: Subscription;
    public record: SDocRecord;

    constructor(private sdocDataService: SDocDataService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.routeSubscription = this.route.params.subscribe(params => {
            const id = params['id'];
            me.sdocDataService.getById(id).then(function doneGetById(sdoc: SDocRecord) {
                    me.record = sdoc;
                },
                function errorCreate(reason: any) {
                    console.error('edit getById failed:' + reason);
                }
            );
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.routeSubscription.unsubscribe();
    }

    submitSave(values: {}) {
        const me = this;
        this.sdocDataService.updateById(values['id'], values).then(function doneUpdateById(sdoc: SDocRecord) {
                me.router.navigateByUrl('/sdoc/list');
            },
            function errorCreate(reason: any) {
                console.error('edit updateById failed:' + reason);
            }
        );
    }
}
