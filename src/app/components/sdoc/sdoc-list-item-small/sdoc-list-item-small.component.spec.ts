/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemSmallComponent} from './sdoc-list-item-small.component';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from '../../../../commons/pipes/truncate.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {SDocSearchFormConverter} from '../../../services/sdoc-searchform-converter.service';
import {SDocRoutingService} from '../../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('SDocListItemSmallComponent', () => {
    let component: SDocListItemSmallComponent;
    let fixture: ComponentFixture<SDocListItemSmallComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TruncatePipe, SDocListItemSmallComponent],
            providers: [DomSanitizer,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 123})
                    }
                },
                {provide: Router, useClass: RouterTestingModule},
                SDocRoutingService,
                SDocSearchFormConverter],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemSmallComponent);
        component = fixture.componentInstance;
        component.record = new SDocRecord({id: '1', name: 'Test'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
