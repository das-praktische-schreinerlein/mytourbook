import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AbstractInlineComponent} from '@dps/mycms-frontend-commons/dist/angular-commons/components/inline.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {ObjectDetectionDetectedObjectType} from '@dps/mycms-commons/src/commons/model/objectdetection-model';
import {SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-odimage-editor',
    templateUrl: './odimage-editor.component.html',
    styleUrls: ['./odimage-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OdImageEditorComponent extends AbstractInlineComponent {
    public static EDITABLE_FIELDS = [
        'imgWidth',
        'imgHeight',
        'objX',
        'objY',
        'objWidth',
        'objHeight',
        'precision'
    ];

    public editFormGroup: FormGroup = this.fb.group(
        OdImageEditorComponent.EDITABLE_FIELDS.reduce(function(map, obj) {
            map['imgobj_' + obj] = {};
            return map;
        }, {})
    );

    @ViewChild('mainImage')
    mainImage: ElementRef;

    @ViewChild('mainImageCanvas')
    mainImageCanvas: ElementRef;
    imageWidth = 0;

    private rect: {
        startX ?: number,
        startY ?: number
        w ?: number,
        h ?: number
    } = {};
    private drag = false;
    private ctx: CanvasRenderingContext2D = undefined;

    @Input()
    public mainImageUrl: SafeUrl = undefined;

    @Input()
    public mainImageObject: ObjectDetectionDetectedObjectType = undefined;

    @Output()
    public changeValue: EventEmitter<ObjectDetectionDetectedObjectType> = new EventEmitter();

    constructor(protected cd: ChangeDetectorRef,
                public fb: FormBuilder
    ) {
        super(cd);
    }

    onInputChanged(value: any, field: string): boolean {
        if (field.startsWith('imgobj_')) {
            this.submitChangedValues();
        }

        return false;
    }

    onLoadMainImage(): boolean {
        if (this.mainImage !== undefined) {
            this.mainImageCanvas.nativeElement.height = this.mainImage.nativeElement.height;
            this.mainImageCanvas.nativeElement.width = this.mainImage.nativeElement.width;
            this.imageWidth = this.mainImage.nativeElement['width'];

            this.ctx = this.mainImageCanvas.nativeElement.getContext('2d');
            this.ctx.drawImage(this.mainImage.nativeElement, 0, 0);

            this.updateImageObject();
            this.cd.markForCheck();
        }

        return false;
    }

    onResizeMainImage(): boolean {
        if (this.mainImage !== undefined && this.mainImage.nativeElement['width'] !== this.imageWidth) {
            this.imageWidth = this.mainImage.nativeElement['width'];
            this.updateImageObject();
            this.cd.markForCheck();
        }

        return false;
    }

    updateImageObject(): boolean {
        if (this.mainImage && this.mainImage.nativeElement['width']) {
            if (!BeanUtils.getValue(this.editFormGroup.getRawValue(), 'imgobj_imgWidth')) {
                this.setValue('imgobj_imgWidth', this.mainImage.nativeElement['width']);
            }
            if (!BeanUtils.getValue(this.editFormGroup.getRawValue(), 'imgobj_imgHeight')) {
                this.setValue('imgobj_imgHeight', this.mainImage.nativeElement['height']);
            }
        }

        return false;
    }

    setValue(field: string, value: any): void {
        const config = {};
        config[field] = value;
        this.editFormGroup.patchValue(config);
    }

    onMouseDown(event: MouseEvent): boolean {
        if (this.rect.h !== 0 || this.rect.w !== 0) {
            this.ctx.drawImage(this.mainImage.nativeElement, 0, 0);
        }

        this.rect.startX = event.offsetX;
        this.rect.startY = event.offsetY;
        this.rect.w = 0;
        this.rect.h = 0;
        this.drag = true;

        return false;
    }

    onMouseUp(event: MouseEvent): boolean {
        this.drag = false;

        const calcFactor = BeanUtils.getValue(this.editFormGroup.getRawValue(), 'imgobj_imgWidth') / this.imageWidth;
        this.setValue('imgobj_objWidth', this.rect.w * calcFactor);
        this.setValue('imgobj_objHeight', this.rect.h * calcFactor);
        this.setValue('imgobj_objX', this.rect.startX * calcFactor);
        this.setValue('imgobj_objY', this.rect.startY * calcFactor);
        this.submitChangedValues();

        return false;
    }

    onMouseMove(event: MouseEvent): boolean {
        if (this.drag) {
            this.rect.w = event.offsetX - this.rect.startX;
            this.rect.h = event.offsetY - this.rect.startY;
            this.draw();
        }

        return false;

    }

    protected draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
    }

    protected updateData(): void {
        const formValueConfig = {};
        for (const editablefield of OdImageEditorComponent.EDITABLE_FIELDS) {
            formValueConfig['imgobj_' + editablefield] = this.mainImageObject
                ? [this.mainImageObject[editablefield]]
                : [];
        }

        this.editFormGroup = this.fb.group(formValueConfig);

        this.onLoadMainImage();
    }

    protected submitChangedValues() {
        const values: ObjectDetectionDetectedObjectType = {
            ...this.mainImageObject
        };

        for (const editableField of OdImageEditorComponent.EDITABLE_FIELDS) {
            values[editableField] = BeanUtils.getValue(this.editFormGroup.getRawValue(), 'imgobj_' + editableField);
        }

        this.changeValue.emit(values);
    }

}
