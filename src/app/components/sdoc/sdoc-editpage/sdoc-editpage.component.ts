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
        this.routeSubscription = this.route.params.subscribe(params => {
            const id = params['id'];
            this.sdocDataService.getById(id).subscribe(
                sdoc => {
                    this.record = sdoc;
                },
                error => {
                },
                () => {
                }
            );
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.routeSubscription.unsubscribe();
    }

    submitSave(values: {}) {
        this.sdocDataService.updateById(values['id'], values).subscribe(
            sdoc => {
                this.router.navigateByUrl('/sdoc/list');
            },
            error => {
                console.error('updateById failed:' + error);
            },
            () => {
            }
        );
    }
}
