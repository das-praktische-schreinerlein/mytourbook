/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemComponent} from './sdoc-list-item.component';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AngularCommonsModule} from '../../../../shared/angular-commons/angular-commons.module';

describe('SDocListItemComponent', () => {
    let component: SDocListItemComponent;
    let fixture: ComponentFixture<SDocListItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListItemComponent],
            providers: [
                DomSanitizer,
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                SDocContentUtils
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot(),
                AngularCommonsModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
