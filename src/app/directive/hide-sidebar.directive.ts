import { Directive, ElementRef, HostListener } from '@angular/core';

declare var jQuery: any;

@Directive({
	selector: '.sidebar-item'
})
export class HideSidebarDirective {

	constructor(private element: ElementRef) { }

	@HostListener('click') onClick() {
		jQuery('.sidebar').sidebar({context:jQuery('app-root')}).sidebar('hide');
	}

}