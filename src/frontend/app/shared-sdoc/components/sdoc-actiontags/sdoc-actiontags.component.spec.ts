/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocActionTagsComponent} from './sdoc-actiontags.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {Router} from '@angular/router';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {SDocAlbumService} from '../../services/sdoc-album.service';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

describe('SDocActionTagsComponent', () => {
    let component: SDocActionTagsComponent;
    let fixture: ComponentFixture<SDocActionTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocActionTagsComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                CommonRoutingService,
                CommonDocRoutingService,
                SDocContentUtils,
                SDocAlbumService,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocActionTagsComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
