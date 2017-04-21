import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MailService {

  private mailgunUrl: string = "sandbox7c5e516fcd614d86bf073d08363e90db.mailgun.org";
  private apiKey: string = window.btoa("api:key-32e407abf2e8f84346f197f9e2df5360");

  constructor(public http: Http) { }

  send(recipient: string, subject: string, message: string) {
    let headers = new Headers(
      {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + this.apiKey
      }
    );
    let options = new RequestOptions({ headers: headers });
    let body = "from=admin@1nicething.net&to=" + recipient + "&subject=" + subject + "&text=" + message;
    return this.http.post("https://api.mailgun.net/v3/" + this.mailgunUrl + "/messages", body, options);
  }


}
