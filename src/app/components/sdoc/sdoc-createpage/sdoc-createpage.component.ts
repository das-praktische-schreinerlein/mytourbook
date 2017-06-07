import {Component, OnDestroy, OnInit} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sdoc-createpage',
    templateUrl: './sdoc-createpage.component.html',
    styleUrls: ['./sdoc-createpage.component.css']
})
export class SDocCreatepageComponent implements OnInit, OnDestroy {
    public record: SDocRecord;

    constructor(private sdocDataService: SDocDataService, private router: Router) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

    onCreate(values: {}) {
        this.record = this.sdocDataService.createRecord(values, undefined);
        this.record.id = this.sdocDataService.generateNewId();
        this.sdocDataService.add(this.record).subscribe(
            sdoc => {
                this.router.navigateByUrl('/record/list');
            },
            error => {
            },
            () => {
            }
        );
    }
}
