import {ChangeDetectorRef, Input} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {CommonDocRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';

export abstract class CommonDocSimpleSearchNavigationComponent extends AbstractInlineComponent {

    @Input()
    public record: CommonDocRecordType;

    constructor(protected cdocRoutingService: CommonDocRoutingService, cd: ChangeDetectorRef) {
        super(cd);
    }

    protected updateData(): void {
    }

    submitBackToSearch() {
        this.cdocRoutingService.navigateBackToSearch('#' + this.record.id);
        return false;
    }

    submitToLastSearchPredecessor() {
        this.cdocRoutingService.navigateToSearchPredecessor();
        return false;
    }

    submitToLastSearchSuccessor() {
        this.cdocRoutingService.navigateToSearchSuccessor();
        return false;
    }

    getBackToSearchUrl(): string {
        return this.cdocRoutingService.getLastSearchUrl() + '#' + this.record.id;
    }

    getLastSearchSuccessorUrl(): string {
        return this.cdocRoutingService.getLastSearchUrlSuccessor();
    }

    getLastSearchPredecessorUrl(): string {
        return this.cdocRoutingService.getLastSearchUrlPredecessor();
    }

}
