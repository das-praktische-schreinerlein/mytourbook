/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackCreatepageComponent} from './track-createpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {TrackDataStore} from '../../../services/track-data.store';

describe('TrackCreatepageComponent', () => {
    let component: TrackCreatepageComponent;
    let fixture: ComponentFixture<TrackCreatepageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TrackCreatepageComponent],
            providers: [TrackDataStore,
                TrackDataService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: Observable.of({id: 123})
                    }
                },
                {provide: Router, useClass: RouterModule}
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrackCreatepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
