import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-treelist',
  templateUrl: './treelist.component.html',
  styleUrls: ['./treelist.component.css']
})
export class TreelistComponent implements OnInit {
  @Input() myHtml: string;
  constructor() { }

  ngOnInit() {
  }

}
