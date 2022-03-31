import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[textOnlyField]'
})
export class TextOnlyFieldDirective {
    constructor(private _el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event) {
        const initalValue = this._el.nativeElement.value;
        this._el.nativeElement.value = initalValue.replace(/[^a-zA-Z //s]*/g, '');
        if (initalValue !== this._el.nativeElement.value) {
            event.stopPropagation();
        }
    }

}
