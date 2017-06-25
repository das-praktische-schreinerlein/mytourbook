/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemSmallComponent} from './sdoc-list-item-small.component';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from '../../../../commons/pipes/truncate.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

describe('SDocListItemSmallComponent', () => {
    let component: SDocListItemSmallComponent;
    let fixture: ComponentFixture<SDocListItemSmallComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TruncatePipe, SDocListItemSmallComponent],
            providers: [
                DomSanitizer,
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                SDocSearchFormConverter,
                SearchFormUtils
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemSmallComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
