/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentFactoryResolver, NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SDocActionsComponent} from './sdoc-actions.component';
import {SDocDynamicComponentService} from '../../services/sdoc-dynamic-components.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocAlbumService} from '../../services/sdoc-album.service';

describe('SDocActionsComponent', () => {
    let component: SDocActionsComponent;
    let fixture: ComponentFixture<SDocActionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocActionsComponent],
            imports: [
                ToastModule.forRoot()
            ],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                ToastsManager,
                SDocDynamicComponentService,
                SDocAlbumService,
                ComponentFactoryResolver
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocActionsComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
