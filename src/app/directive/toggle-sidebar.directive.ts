import { Directive, ElementRef, HostListener } from '@angular/core';

declare var jQuery: any;

@Directive({
	selector: '.navicon'
})
export class ToggleSidebarDirective {

	constructor(private element: ElementRef) { }

	@HostListener('click') onClick() {
		jQuery('.sidebar').sidebar({context:jQuery('app-root')}).sidebar('toggle');
	}

}