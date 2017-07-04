import {Component, Input} from '@angular/core';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-sdoc-linked-loc-hierarchy',
    templateUrl: './sdoc-linked-loc-hierarchy.component.html',
    styleUrls: ['./sdoc-linked-loc-hierarchy.component.css']
})
export class SDocLinkedLocHierarchyComponent {
    public contentUtils: SDocContentUtils;

    @Input()
    public record: SDocRecord;

    @Input()
    public lastOnly? = false;

    constructor(private sanitizer: DomSanitizer, private router: Router,
                private sdocRoutingService: SDocRoutingService, contentUtils: SDocContentUtils) {
        this.contentUtils = contentUtils;
    }

    public submitShow(): boolean {
        this.router.navigateByUrl(this.getUrl(location));
        return false;
    }

    public getShowUrl(location: any): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(this.getUrl(location));
    }

    private getUrl(location: any): string {
        return this.sdocRoutingService.getShowUrl(new SDocRecord({id: location[0], name: location[1], type: 'LOCATION'}), '');
    }

}
