/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackListFooterComponent} from './track-list-footer.component';
import {Track} from '../../../model/track';

describe('TrackListFooterComponent', () => {
  let component: TrackListFooterComponent;
  let fixture: ComponentFixture<TrackListFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackListFooterComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackListFooterComponent);
    component = fixture.componentInstance;
    component.tracks = [
      new Track({ id: 1, name: 'Test' })
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
