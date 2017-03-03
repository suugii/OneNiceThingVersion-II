import { Directive, OnInit, OnDestroy, ElementRef, Input, Output } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

declare var jQuery: any;

@Directive({
	selector: '.ui.search'
})
export class SearchDirective implements OnInit, OnDestroy {
	@Input() public users: string[];

	constructor(private af: AngularFire, private element: ElementRef) {
		this.users = [];
		af.database.list('users').forEach((datas) => {
			datas.forEach(data => {
				this.users.push(data);
			});
		});

	}

	public ngOnInit() {
		jQuery(this.element.nativeElement).search({
			searchFields: ['email'],
			source: this.users,
			onSelect: function (event) {
				console.log(event);
			}
		});
	}

	public ngOnDestroy() {
		jQuery(this.element.nativeElement).search('destroy');
	}

}