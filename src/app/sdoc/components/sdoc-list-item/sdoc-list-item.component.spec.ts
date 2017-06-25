/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemComponent} from './sdoc-list-item.component';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TruncatePipe} from '../../../../commons/pipes/truncate.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';

describe('SDocListItemComponent', () => {
    let component: SDocListItemComponent;
    let fixture: ComponentFixture<SDocListItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TruncatePipe, SDocListItemComponent],
            providers: [DomSanitizer,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 123})
                    }
                },
                {provide: Router, useClass: RouterTestingModule},
                SDocRoutingService,
                SDocSearchFormConverter, SearchFormUtils],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemComponent);
        component = fixture.componentInstance;
        component.record = new SDocRecord({id: '1', name: 'Test'});
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
