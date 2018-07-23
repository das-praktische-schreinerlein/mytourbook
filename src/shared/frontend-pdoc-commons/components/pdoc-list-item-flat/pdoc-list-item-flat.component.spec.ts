/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PDocListItemFlatComponent} from './pdoc-list-item-flat.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {PDocDataServiceStub} from '../../../testing/pdoc-dataservice-stubs';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';

describe('PDocListItemFlatComponent', () => {
    let component: PDocListItemFlatComponent;
    let fixture: ComponentFixture<PDocListItemFlatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PDocListItemFlatComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PDocListItemFlatComponent);
        component = fixture.componentInstance;
        component.record = PDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
