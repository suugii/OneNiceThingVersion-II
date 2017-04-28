import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MailService {

  private mailgunUrl: string = "mg.1nicething.net";
  private apiKey: string = window.btoa("api:key-edd9df078d733760e9ebfec6763a6b33");

  constructor(public http: Http) { }

  send(recipient: string, subject: string, message: string) {
    let headers = new Headers(
      {
        "Allow-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + this.apiKey,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Accept, Authorization, Content-Type"
      }
    );
    let options = new RequestOptions({ headers: headers });
    let body = "from=admin@1nicething.net&to=" + recipient + "&subject=" + subject + "&text=" + message;
    return this.http.post("https://api.mailgun.net/v3/" + this.mailgunUrl + "/messages", body, options);
  }


}
