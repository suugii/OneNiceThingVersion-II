import { BrowserModule } from '@angular/platform-browser';
import { NgModule,enableProdMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Route } from './app.route';

import { AngularFireModule } from 'angularfire2';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { ImageUploadModule } from 'ng2-imageupload';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { DragScrollModule } from 'angular2-drag-scroll';
import { TreeModule } from 'angular-tree-component';
import { CustomFormsModule } from 'ng2-validation'
import { FormWizardModule } from 'angular2-wizard';
import { ImageCropperModule } from "ng2-img-cropper";

import { AuthService } from "./service/auth.service";
import { StoryService } from "./service/story.service";
import { ContactService } from "./service/contact.service";
import { GuardService } from "./service/guard.service";
import { SpinnerService } from './service/spinner.service';

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
import { UserRequestsComponent } from './profile/user-requests/user-requests.component';
import { UserOriginateComponent } from './profile/user-originate/user-originate.component';
import { EqualValidator } from './directive/equal-validator.directive';
import { UserTreeComponent } from './profile/user-tree/user-tree.component';
import { TreelistComponent } from './profile/treelist/treelist.component';
import { UserMapComponent } from './profile/user-map/user-map.component';
import { FitContentsDirective } from './directive/fit-contents.directive';
import { ToggleSidebarDirective } from './directive/toggle-sidebar.directive';
import { HideSidebarDirective } from './directive/hide-sidebar.directive';
import { SpinnerComponent } from './spinner/spinner.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


export const firebaseConfig = {
	apiKey: "AIzaSyCHlOL_xE9jBGUBTsGp42ZJq-_Un9wWIXs",
	authDomain: "nicething-56579.firebaseapp.com",
	databaseURL: "https://nicething-56579.firebaseio.com",
	storageBucket: "nicething-56579.appspot.com",
	messagingSenderId: "349795079971"
};

enableProdMode();

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
		UserRequestsComponent,
		UserOriginateComponent,
		EqualValidator,
		UserTreeComponent,
		TreelistComponent,
		UserMapComponent,
		FitContentsDirective,
		ToggleSidebarDirective,
		HideSidebarDirective,
		SpinnerComponent,
		PageNotFoundComponent,
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule,
		Route,
		DragScrollModule,
		CustomFormsModule,
		InfiniteScrollModule,
		ImageUploadModule,
		FormWizardModule,
		TreeModule,
		ImageCropperModule,
		Ng2AutoCompleteModule,
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
		SpinnerService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }