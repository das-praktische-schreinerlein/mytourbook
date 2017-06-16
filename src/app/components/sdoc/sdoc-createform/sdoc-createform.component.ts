import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-sdoc-createform',
    templateUrl: './sdoc-createform.component.html',
    styleUrls: ['./sdoc-createform.component.css']
})
export class SDocCreateformComponent implements OnInit {

    @Input()
    public record: SDocRecord;

    @Output()
    public create: EventEmitter<SDocRecord> = new EventEmitter();

    // empty default
    public createFormGroup = this.fb.group({
        name: '',
        desc: ''
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        if (this.record) {
            this.createFormGroup = this.fb.group({
                name: [this.record.name, Validators.required],
                desc: [this.record.desc, Validators.required]
            });
        }
    }

    submitCreate(event: Event) {
        this.create.emit(this.createFormGroup.getRawValue());
        return false;
    }
}
