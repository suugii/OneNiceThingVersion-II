import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

declare var jQuery: any;

@Directive({
	selector: '.ui.search'
})
export class SearchDirective implements OnInit, OnDestroy {

    users: FirebaseListObservable<any[]>;

	constructor(private af: AngularFire, private element: ElementRef) {
        this.users = af.database.list('users');
	}

	public ngOnInit() {
		jQuery(this.element.nativeElement).search({
			source:[
				{ title: 'Andorra' },
				{ title: 'United Arab Emirates' },
				{ title: 'Afghanistan' },
				{ title: 'Antigua' },
				{ title: 'Anguilla' },
				{ title: 'Albania' },
				{ title: 'Armenia' },
				{ title: 'Netherlands Antilles' },
				{ title: 'Angola' },
				{ title: 'Argentina' },
				{ title: 'American Samoa' },
				{ title: 'Austria' },
				{ title: 'Australia' },
				{ title: 'Aruba' },
				{ title: 'Aland Islands' },
				{ title: 'Azerbaijan' },
				{ title: 'Bosnia' },
				{ title: 'Barbados' },
				{ title: 'Bangladesh' },
				{ title: 'Belgium' },
				{ title: 'Burkina Faso' },
				{ title: 'Bulgaria' },
				{ title: 'Bahrain' },
				{ title: 'Burundi' }
			]
		});
	}

	public ngOnDestroy() {
		jQuery(this.element.nativeElement).search('destroy');
	}

}