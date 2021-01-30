/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {VisJsProfileChartComponent} from './visjs-profilechart.component';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {SimpleAngularBackendHttpClient} from '@dps/mycms-frontend-commons/dist/angular-commons/services/simple-angular-backend-http-client';

describe('VisJsProfileChartComponent', () => {
    let component: VisJsProfileChartComponent;
    let fixture: ComponentFixture<VisJsProfileChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VisJsProfileChartComponent],
            imports: [ReactiveFormsModule, HttpClientModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                    { provide: MinimalHttpBackendClient, useClass: SimpleAngularBackendHttpClient }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VisJsProfileChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
