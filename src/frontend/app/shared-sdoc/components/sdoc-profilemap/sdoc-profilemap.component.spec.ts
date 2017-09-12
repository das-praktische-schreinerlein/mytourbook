/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SDocProfileMapComponent} from './sdoc-profilemap.component';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';

describe('SDocProfileMapComponent', () => {
    let component: SDocProfileMapComponent;
    let fixture: ComponentFixture<SDocProfileMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocProfileMapComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocProfileMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
