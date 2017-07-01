/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SDocLeafletMapComponent} from './sdoc-leaflet-map.component';
import {AppServiceStub} from '../../../../testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/search-commons/services/generic-app.service';

describe('SDocLeafletMapComponent', () => {
    let component: SDocLeafletMapComponent;
    let fixture: ComponentFixture<SDocLeafletMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocLeafletMapComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocLeafletMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});