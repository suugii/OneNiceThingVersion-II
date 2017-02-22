import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-about-page',
	templateUrl: './about-page.component.html',
	styleUrls: ['./about-page.component.css']
})
export class AboutPageComponent implements OnInit {
	public title: string = 'About us';
	public content1: string = 'Does helping others really make the world a better place? Do random acts of kindness create any positive impact on the lives of others? We think so, but wanted to find a way to prove it.';
	public content2: string = 'We developed this site to find out just how far One Nice Thing can go, and the impact it can have on the people that it touches.';

	constructor() { }

	ngOnInit() { }

}
