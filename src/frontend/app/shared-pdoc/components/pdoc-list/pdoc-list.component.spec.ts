/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PDocListComponent} from './pdoc-list.component';
import {TranslateModule} from '@ngx-translate/core';

describe('PDocListComponent', () => {
    let component: PDocListComponent;
    let fixture: ComponentFixture<PDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PDocListComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PDocListComponent);
        component = fixture.componentInstance;
        component.records = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
