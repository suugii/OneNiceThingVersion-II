import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { AfService } from "../../providers/af.service";
import { FirebaseListObservable } from "angularfire2";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  public newMessage: string;
  public messages: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  public receiver: any;
  constructor(public afService: AfService) {
  }

  ngOnInit() {
    this.messages = this.afService.messages;
    this.users = this.afService.getUsers();
  }

  isYou(email) {
    if (email == this.afService.email)
      return true;
    else
      return false;
  }
  isMe(email) {
    if (email == this.afService.email)
      return false;
    else
      return true;
  }

  userClicked(data) {
    this.receiver = data;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { console.log('Scroll to bottom failed yo!') }
  }

  sendMessage() {
    this.afService.sendMessage(this.receiver, this.newMessage);
    this.newMessage = '';
  }

  getMessage(data) {
    this.afService.getMessage(data);
  }
}
