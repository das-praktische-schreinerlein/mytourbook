/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TrackEditformComponent} from './track-editform.component';
import {TrackRecord} from '../../../model/records/track-record';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

describe('TrackEditformComponent', () => {
  let component: TrackEditformComponent;
  let fixture: ComponentFixture<TrackEditformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEditformComponent],
      imports: [ReactiveFormsModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEditformComponent);
    component = fixture.componentInstance;
    component.track = new TrackRecord({ id: 1, name: 'Test' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
