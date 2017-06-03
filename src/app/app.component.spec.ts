/* tslint:disable:no-unused-variable */
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TrackDataService} from './services/track-data.service';
import {Router} from '@angular/router';
import {AppService} from './services/app.service';
import {TrackDataStore} from './services/track-data.store';
import {RouterTestingModule} from '@angular/router/testing';

class MockAppService {
    public initApp(): void {
    }
}

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                {provide: Router, useClass: RouterTestingModule},
                TrackDataStore,
                TrackDataService,
                {provide: AppService, useClass: MockAppService}
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'MyTourBook'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('MyTourBook');
    }));

    it('should render title in a h1 tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('MyTourBook');
    }));
});
