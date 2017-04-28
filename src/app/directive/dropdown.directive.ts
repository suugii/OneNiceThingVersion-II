import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
	selector: '.ui.dropdown'
})
export class DropdownDirective implements OnInit, OnDestroy {

	constructor(public element: ElementRef) { }

	public ngOnInit() {
		jQuery(this.element.nativeElement).dropdown();
	}

	public ngOnDestroy() {
		jQuery(this.element.nativeElement).dropdown('destroy');
	}

}
