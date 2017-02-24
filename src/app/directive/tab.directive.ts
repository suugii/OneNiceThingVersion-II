import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';

declare var jQuery: any;

@Directive({
  selector: '.wizard-item'
})
export class TabDirective implements OnInit, OnDestroy {

	constructor(private element: ElementRef) { }

	public ngOnInit() {
		jQuery(this.element.nativeElement).tab();
	}

	public ngOnDestroy() {
		jQuery(this.element.nativeElement).tab('destroy');
	}

}