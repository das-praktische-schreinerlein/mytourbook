/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CDocListFooterComponent} from './cdoc-list-footer.component';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CDocListFooterComponent', () => {
    let component: CDocListFooterComponent;
    let fixture: ComponentFixture<CDocListFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CDocListFooterComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CDocListFooterComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
