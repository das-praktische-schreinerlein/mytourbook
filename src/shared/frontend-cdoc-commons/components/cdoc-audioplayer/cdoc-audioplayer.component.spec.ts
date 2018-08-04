/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../services/cdoc-contentutils.service';
import {AngularCommonsModule} from '../../../angular-commons/angular-commons.module';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';
import {DatePipe} from '@angular/common';
import {CDocAudioplayerComponent} from './cdoc-audioplayer.component';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CDocAudioplayerComponent', () => {
    let component: CDocAudioplayerComponent;
    let fixture: ComponentFixture<CDocAudioplayerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CDocAudioplayerComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                DatePipe,
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
        fixture = TestBed.createComponent(CDocAudioplayerComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
