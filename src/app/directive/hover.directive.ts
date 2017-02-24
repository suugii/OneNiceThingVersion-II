import { Directive, ElementRef, HostListener } from '@angular/core';

declare var jQuery: any;

@Directive({
	selector: '.dimmable.image',
})
export class HoverDirective {

	constructor(private element: ElementRef) { }

	@HostListener('mouseenter') onMouseEnter() {
		jQuery(this.element.nativeElement).dimmer('show');
	}

	@HostListener('mouseleave') onMouseLeave() {
		jQuery(this.element.nativeElement).dimmer('hide');
	}

}