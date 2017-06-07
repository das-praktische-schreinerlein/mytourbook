import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'app-sdoc-editform',
    templateUrl: './sdoc-editform.component.html',
    styleUrls: ['./sdoc-editform.component.css']
})
export class SDocEditformComponent implements OnInit {

    @Input()
    public record: SDocRecord;

    @Output()
    save: EventEmitter<SDocRecord> = new EventEmitter();

    // empty default
    editFormGroup = this.fb.group({
        id: '',
        name: '',
        desc: ''
    });

    constructor(public fb: FormBuilder) {
    }

    ngOnInit() {
        if (this.record) {
            this.editFormGroup = this.fb.group({
                id: this.record.id,
                name: [this.record.name, Validators.required],
                desc: [this.record.desc, Validators.required]
            });
        }
    }

    submitSave() {
        this.save.emit(this.editFormGroup.getRawValue());
    }
}
