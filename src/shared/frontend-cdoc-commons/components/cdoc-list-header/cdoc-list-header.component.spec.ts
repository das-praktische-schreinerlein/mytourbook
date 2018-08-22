/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonDocListHeaderComponent} from './cdoc-list-header.component';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CommonDocListHeaderComponent', () => {
    let component: CommonDocListHeaderComponent;
    let fixture: ComponentFixture<CommonDocListHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommonDocListHeaderComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot()],
            providers: [
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonDocListHeaderComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
