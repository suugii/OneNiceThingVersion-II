import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.css']
})
export class MydashboardComponent implements OnInit {
  lat: number = 47.919991;
  lng: number = 106.917708;
  latA: number = 47.907018;
  lngA: number = 106.908609;
  latB: number = 47.911462;
  lngB: number = 106.964983;
  zoom: number = 13;
  iconURL: any = {
    url: "https://lh6.googleusercontent.com/-ZmFd6FCjwiQ/AAAAAAAAAAI/AAAAAAAAB_k/VL_7wG3-LoY/photo.jpg",
    scaledSize: {
      height: 40,
      width: 40
    }
  };
  iconURL1: any = {
    url: "http://www.famousbirthdays.com/headshots/ne-yo-3.jpg",
    scaledSize: {
      height: 40,
      width: 40
    }
  }
  constructor() {
  }

  ngOnInit() {
  }

}