import {TruncatePipe} from './pipes/truncate.pipe';
import {NgModule} from '@angular/core';
@NgModule({
    declarations: [
        TruncatePipe
    ],
    exports: [
        TruncatePipe
    ]
})
export class CommonsModule {
}
