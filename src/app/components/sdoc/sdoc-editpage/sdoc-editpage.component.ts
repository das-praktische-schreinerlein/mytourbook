import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AppService, AppState} from '../../../services/app.service';
import * as util from 'util';
import {ToastsManager} from 'ng2-toastr';

@Component({
    selector: 'app-sdoc-editpage',
    templateUrl: './sdoc-editpage.component.html',
    styleUrls: ['./sdoc-editpage.component.css']
})
export class SDocEditpageComponent implements OnInit, OnDestroy {
    private routeSubscription: Subscription;
    private appStateSubscription: Subscription;
    public record: SDocRecord;

    constructor(private appService: AppService, private router: Router, private route: ActivatedRoute,
                private sdocDataService: SDocDataService, private toastr: ToastsManager, vcr: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        // Subscribe to route params
        const me = this;
        this.routeSubscription = this.route.params.subscribe(params => {
            const id = params['id'];
            me.appStateSubscription = me.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    me.sdocDataService.getById(id).then(function doneGetById(sdoc: SDocRecord) {
                            me.record = sdoc;
                        },
                        function errorGetById(reason: any) {
                            me.toastr.error('Es gibt leider Probleme bei der Lesen - am besten noch einmal probieren :-(', 'Oops!');
                            console.error('edit getById failed:' + reason);
                        }
                    );
                }
            });
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        if (!util.isUndefined(this.routeSubscription)) {
            this.routeSubscription.unsubscribe();
        }
        if (!util.isUndefined(this.appStateSubscription)) {
            this.appStateSubscription.unsubscribe();
        }
    }

    submitSave(values: {}) {
        const me = this;

        this.sdocDataService.updateById(values['id'], values).then(function doneUpdateById(sdoc: SDocRecord) {
                let redirectUrl = '/sdoc/list';
                const from = me.route.snapshot.queryParamMap.get('from');
                if (from !== undefined && from.startsWith('/sdocs/')) {
                    redirectUrl = from;
                }
                me.router.navigateByUrl(redirectUrl);
            },
            function errorCreate(reason: any) {
                console.error('edit updateById failed:' + reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oops!');
            }
        );
    }
}
