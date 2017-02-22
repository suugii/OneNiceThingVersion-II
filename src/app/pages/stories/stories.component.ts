import { Component, OnInit } from '@angular/core';
import { StoryService } from "../../providers/story.service";
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  public stories: any;
  constructor(public storyService: StoryService, public afService: AfService) {
    
  }

  ngOnInit() {
  }

}
