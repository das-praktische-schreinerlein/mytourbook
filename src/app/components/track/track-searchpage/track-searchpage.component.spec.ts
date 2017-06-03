/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackSearchpageComponent} from './track-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TrackDataStore} from '../../../services/track-data.store';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs';

describe('TrackSearchpageComponent', () => {
    let component: TrackSearchpageComponent;
    let fixture: ComponentFixture<TrackSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackSearchpageComponent],
            providers: [TrackDataStore,
                TrackDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        url: Observable.of({}),
                        params: Observable.of({})
                    }
                },
                {
                    provide: Router,
                    useClass: RouterTestingModule
                }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
