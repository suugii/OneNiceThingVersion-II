import { Directive, OnInit, OnDestroy, ElementRef, Input, Output } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

declare var jQuery: any;

@Directive({
	selector: '.ui.search'
})
export class SearchDirective implements OnInit, OnDestroy {
	@Input() public users: any[];

	constructor(private af: AngularFire, private element: ElementRef) {
		this.users = [];
		af.database.list('users').forEach((datas) => {
			datas.forEach(data => {
				this.users.push({ 'title': data.email });
			});
		});

	}

	public ngOnInit() {
		jQuery(this.element.nativeElement).search({
			source: this.users,
			searchFields: [
				'title'
			],
			onSelect: function (result, response) {
				console.log(result)
			}
		});
	}

	public ngOnDestroy() {
		jQuery(this.element.nativeElement).search('destroy');
	}

}