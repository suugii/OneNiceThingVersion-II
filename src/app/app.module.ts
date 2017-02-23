import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.route';

import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { SuiModule } from 'ng2-semantic-ui/ng2-semantic-ui';
/* Services */
import { AfService } from "./providers/af.service";
import { AuthGuardService } from "./providers/auth-guard.service";
/* Components */
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PasswordresetPageComponent } from './pages/passwordreset-page/passwordreset-page.component';
import { ConfirmpasswordPageComponent } from './pages/confirmpassword-page/confirmpassword-page.component';
import { AddStoryComponent } from './pages/add-story/add-story.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HowitworksPageComponent } from './pages/howitworks-page/howitworks-page.component';
import { MypageComponent } from './pages/mypage/mypage.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { MystoriesComponent } from './pages/mystories/mystories.component';
import { MyfriendsComponent } from './pages/myfriends/myfriends.component';
import { MyfavoritesComponent } from './pages/myfavorites/myfavorites.component';
import { MydashboardComponent } from './pages/mydashboard/mydashboard.component';

export const firebaseConfig = {
    apiKey: "AIzaSyBEvKg7dHarnUD5ZIY7ZAhlaDrQ3WF7F4k",
    authDomain: "nicething-5c833.firebaseapp.com",
    databaseURL: "https://nicething-5c833.firebaseio.com",
    storageBucket: "nicething-5c833.appspot.com",
    messagingSenderId: "868527023994"
};


@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        LoginPageComponent,
        RegisterPageComponent,
        PasswordresetPageComponent,
        ConfirmpasswordPageComponent,
        AddStoryComponent,
        StoriesComponent,
        ChatComponent,
        HowitworksPageComponent,
        MypageComponent,
        AboutPageComponent,
        ContactPageComponent,
        MystoriesComponent,
        MyfriendsComponent,
        MyfavoritesComponent,
        MydashboardComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        SuiModule,
        AngularFireModule.initializeApp(firebaseConfig),
    ],
    providers: [AfService, AuthGuardService],
    bootstrap: [AppComponent]
})
export class AppModule { }
