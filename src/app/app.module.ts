import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Route } from './app.route';

import { AngularFireModule } from 'angularfire2';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AuthService } from "./service/auth.service";
import { StoryService } from "./service/story.service";
import { ContactService } from "./service/contact.service";
import { GuardService } from "./service/guard.service";

import { AppComponent } from './app.component';
import { HomeComponent } from './page/home/home.component';
import { AboutComponent } from './page/about/about.component';
import { ContactComponent } from './page/contact/contact.component';
import { StoriesComponent } from './page/stories/stories.component';
import { StoryComponent } from './page/story/story.component';
import { CreateComponent } from './page/create/create.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { WorkComponent } from './page/work/work.component';
import { UserStoriesComponent } from './profile/user-stories/user-stories.component';
import { UserFriendsComponent } from './profile/user-friends/user-friends.component';
import { UserFavoritesComponent } from './profile/user-favorites/user-favorites.component';
import { DashboardComponent } from './profile/dashboard/dashboard.component';
import { UserHomeComponent } from './profile/user-home/user-home.component';
import { PasswordconfirmComponent } from './auth/passwordconfirm/passwordconfirm.component';
import { PasswordresetComponent } from './auth/passwordreset/passwordreset.component';
import { DropdownDirective } from './directive/dropdown.directive';
import { TabDirective } from './directive/tab.directive';
import { HoverDirective } from './directive/hover.directive';
import { UserSettingsComponent } from './profile/user-settings/user-settings.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ChatComponent } from './profile/chat/chat.component';
import { EditStoryComponent } from './profile/edit-story/edit-story.component';
import { SearchDirective } from './directive/search.directive';
import { UserComponent } from './page/user/user.component';

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
		HomeComponent,
		AboutComponent,
		ContactComponent,
		StoriesComponent,
		StoryComponent,
		CreateComponent,
		LoginComponent,
		RegisterComponent,
		WorkComponent,
		UserStoriesComponent,
		UserFriendsComponent,
		UserFavoritesComponent,
		DashboardComponent,
		UserHomeComponent,
		PasswordresetComponent,
		PasswordconfirmComponent,
		DropdownDirective,
		TabDirective,
		HoverDirective,
		UserSettingsComponent,
		ChangePasswordComponent,
		ChatComponent,
		EditStoryComponent,
		SearchDirective,
		UserComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		Route,
		InfiniteScrollModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyB4ygPHxCDU4qhpJYcJhvgGmg6Rrp-2l84',
			libraries: ['places']
		}),
	],
	providers: [
		AuthService,
		GuardService,
		StoryService,
		ContactService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }