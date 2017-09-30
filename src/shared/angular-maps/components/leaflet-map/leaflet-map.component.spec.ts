/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {LeafletMapComponent} from './leaflet-map.component';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {SimpleAngularBackendHttpClient} from '../../../angular-commons/services/simple-angular-backend-http-client';
import {MinimalHttpBackendClient} from '../../../commons/services/minimal-http-backend-client';

describe('LeafletMapComponent', () => {
    let component: LeafletMapComponent;
    let fixture: ComponentFixture<LeafletMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LeafletMapComponent],
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
        fixture = TestBed.createComponent(LeafletMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
