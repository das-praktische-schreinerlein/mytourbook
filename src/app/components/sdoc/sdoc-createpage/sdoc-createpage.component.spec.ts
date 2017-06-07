/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocCreatepageComponent} from './sdoc-createpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../services/sdoc-data.service';
import {Router} from '@angular/router';
import {SDocDataStore} from '../../../services/sdoc-data.store';
import {RouterTestingModule} from '@angular/router/testing';

describe('SDocCreatepageComponent', () => {
    let component: SDocCreatepageComponent;
    let fixture: ComponentFixture<SDocCreatepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocCreatepageComponent],
            providers: [SDocDataStore,
                SDocDataService,
                {provide: Router, useClass: RouterTestingModule}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocCreatepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
