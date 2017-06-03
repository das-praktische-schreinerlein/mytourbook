/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackEditpageComponent} from './track-editpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {TrackDataStore} from '../../../services/track-data.store';
import {RouterTestingModule} from '@angular/router/testing';

describe('TrackEditpageComponent', () => {
    let component: TrackEditpageComponent;
    let fixture: ComponentFixture<TrackEditpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [TrackDataStore,
                TrackDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 123})
                    }
                },
                {provide: Router, useClass: RouterTestingModule}
            ],
            declarations: [TrackEditpageComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackEditpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
