/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackSearchpageComponent} from './track-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from '../../../services/track-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TrackDataStore} from '../../../services/track-data.store';
import {Observable} from 'rxjs';

class RouterStub {
    public routerState: {} = {
        snapshot: {
            url: 'track'
        }
    };
    navigateByUrl(url: string) { return url; }
}

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
                        params: Observable.of({id: 1})
                    }
                },
                {provide: Router, useValue: new RouterStub() }
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
