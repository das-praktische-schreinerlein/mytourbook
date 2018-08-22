/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonDocListFooterComponent} from './cdoc-list-footer.component';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CommonDocListFooterComponent', () => {
    let component: CommonDocListFooterComponent;
    let fixture: ComponentFixture<CommonDocListFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommonDocListFooterComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonDocListFooterComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
