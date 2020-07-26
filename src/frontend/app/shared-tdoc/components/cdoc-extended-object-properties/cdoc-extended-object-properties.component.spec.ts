/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocExtendedObjectPropertiesComponent} from './cdoc-extended-object-properties.component';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';

describe('CommonDocExtendedObjectPropertiesComponent', () => {
    let component: CommonDocExtendedObjectPropertiesComponent;
    let fixture: ComponentFixture<CommonDocExtendedObjectPropertiesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommonDocExtendedObjectPropertiesComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommonDocExtendedObjectPropertiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
