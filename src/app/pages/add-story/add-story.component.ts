import { Component, OnInit } from '@angular/core';
import { StoryService } from "../../providers/story.service";
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
  public currentUid: any;
  public users: FirebaseListObservable<any>;
  public error: any;
  public icon: boolean = true;
  public options: Array<string> = ["Apple", "Bird", "Car", "Dog", "Elephant", "Finch", "Gate",
    "Horrify", "Indigo", "Jelly", "Keep", "Lemur", "Manifest", "None", "Orange", "Peel", "Quest",
    "Resist", "Suspend", "Terrify", "Underneath", "Violet", "Water", "Xylophone", "Yellow", "Zebra"];

  constructor(public storyService: StoryService, public afService: AfService) {
    this.users = this.afService.getUsers();
  }

  ngOnInit() {
  }

  submitForm(data) {
    // this.storyService.saveStory(data).then(() => {
    //   console.log('success');
    // })
    //   .catch((error: any) => {
    //     if (error) {
    //       this.error = error;
    //       console.log(this.error);
    //     }
    //   });
  }

}
