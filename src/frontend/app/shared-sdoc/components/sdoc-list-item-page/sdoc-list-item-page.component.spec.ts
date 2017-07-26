/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemPageComponent} from './sdoc-list-item-page.component';
import {DomSanitizer} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {SDocRoutingService} from '../../services/sdoc-routing.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';
import {AngularCommonsModule} from '../../../../shared/angular-commons/angular-commons.module';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';

describe('SDocListItemPageComponent', () => {
    let component: SDocListItemPageComponent;
    let fixture: ComponentFixture<SDocListItemPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListItemPageComponent],
            providers: [
                DomSanitizer,
                { provide: Router, useClass: RouterTestingModule },
                SDocRoutingService,
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot(),
                AngularCommonsModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemPageComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});