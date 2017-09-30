/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {VisJsProfileMapComponent} from './visjs-profilemap.component';
import {SimpleAngularBackendHttpClient} from '../../../angular-commons/services/simple-angular-backend-http-client';
import {MinimalHttpBackendClient} from '../../../commons/services/minimal-http-backend-client';

describe('VisJsProfileMapComponent', () => {
    let component: VisJsProfileMapComponent;
    let fixture: ComponentFixture<VisJsProfileMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VisJsProfileMapComponent],
            imports: [ReactiveFormsModule, HttpModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                    { provide: XHRBackend, useClass: MockBackend },
                    { provide: MinimalHttpBackendClient, useClass: SimpleAngularBackendHttpClient }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VisJsProfileMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
