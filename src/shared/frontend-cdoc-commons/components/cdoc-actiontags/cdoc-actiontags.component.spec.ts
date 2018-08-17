/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CDocActionTagsComponent} from './cdoc-actiontags.component';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {CommonDocRoutingService} from '../../services/cdoc-routing.service';
import {PlatformService} from '../../../angular-commons/services/platform.service';
import {Router} from '@angular/router';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';
import {CommonDocAlbumService} from '../../services/cdoc-album.service';
import {CommonDocContentUtils} from '../../services/cdoc-contentutils.service';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CDocActionTagsComponent', () => {
    let component: CDocActionTagsComponent;
    let fixture: ComponentFixture<CDocActionTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CDocActionTagsComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                CommonDocAlbumService,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CDocActionTagsComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
