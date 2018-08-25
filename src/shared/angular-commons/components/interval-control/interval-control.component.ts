import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
    selector: 'app-interval-control',
    templateUrl: './interval-control.component.html',
    styleUrls: ['./interval-control.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalControlComponent implements OnDestroy {
    intervalRunning = false;
    interval = undefined;
    intervalTimeout = 5;

    @Output()
    public intervalStarted: EventEmitter<any> = new EventEmitter();

    @Output()
    public intervalNext: EventEmitter<any> = new EventEmitter();

    @Output()
    public intervalStopped: EventEmitter<any> = new EventEmitter();

    public intervalFormGroup: FormGroup = this.fb.group({
        intervalTimeout: [5]
    });

    constructor(private cd: ChangeDetectorRef,  public fb: FormBuilder) {
    }

    ngOnDestroy() {
        this.clearIntervall();
    }

    onIntervalTimeoutChange(event: Event): boolean {
        const timeout = event.target['value'];
        if (timeout > 1) {
            this.intervalTimeout = timeout;
            this.doRunInterval(false);
            this.doRunInterval(true);
        } else {
            console.warn('illegal Interval:' + timeout, event);
        }

        this.cd.markForCheck();

        return false;
    }

    doRunInterval(run: boolean): boolean {
        const me = this;
        if (run && !this.intervalRunning && this.interval === undefined) {
            this.interval = setInterval(args => {
                me.intervalNext.emit();
            }, (me.intervalTimeout ? me.intervalTimeout : 999999) * 1000);
            me.intervalRunning = true;
            me.intervalStarted.emit();
        } else {
            me.clearIntervall();
            me.intervalRunning = false;
            me.intervalStopped.emit();
        }

        this.cd.markForCheck();

        return false;
    }

    private clearIntervall(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
