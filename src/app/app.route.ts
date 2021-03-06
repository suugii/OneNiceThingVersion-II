import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from './service/guard.service';
import { AuthGuardService } from './service/auth-guard.service';

import { HomeComponent } from './page/home/home.component';
import { CreateComponent } from './page/create/create.component';
import { StoriesComponent } from './page/stories/stories.component';
import { StoryComponent } from './page/story/story.component';
import { UserComponent } from './page/user/user.component';
import { AboutComponent } from './page/about/about.component';
import { ContactComponent } from './page/contact/contact.component';
import { WorkComponent } from './page/work/work.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserStoriesComponent } from './profile/user-stories/user-stories.component';
import { UserFriendsComponent } from './profile/user-friends/user-friends.component';
import { UserFavoritesComponent } from './profile/user-favorites/user-favorites.component';
import { DashboardComponent } from './profile/dashboard/dashboard.component';
import { UserHomeComponent } from './profile/user-home/user-home.component';
import { PasswordconfirmComponent } from './auth/passwordconfirm/passwordconfirm.component';
import { PasswordresetComponent } from './auth/passwordreset/passwordreset.component';
import { UserSettingsComponent } from './profile/user-settings/user-settings.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ChatComponent } from './profile/chat/chat.component';
import { EditStoryComponent } from './profile/edit-story/edit-story.component';
import { UserRequestsComponent } from './profile/user-requests/user-requests.component';
import { UserOriginateComponent } from './profile/user-originate/user-originate.component';
import { UserTreeComponent } from './profile/user-tree/user-tree.component';
import { UserMapComponent } from './profile/user-map/user-map.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const Route: ModuleWithProviders = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'create', component: CreateComponent },
    { path: 'stories', component: StoriesComponent },
    { path: 'stories/:key', component: StoryComponent },
    { path: 'user/:key', component: UserComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'work', component: WorkComponent },

    { path: 'login', component: LoginComponent, canActivate: [AuthGuardService] },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuardService] },
    { path: 'resetpassword', component: PasswordresetComponent },
    { path: 'confirmpassword', component: PasswordconfirmComponent },
    {
        path: 'profile', component: DashboardComponent, canActivate: [GuardService], children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: UserHomeComponent, canActivate: [GuardService] },
            { path: 'friends', component: UserFriendsComponent, canActivate: [GuardService] },
            { path: 'tree', component: UserTreeComponent, canActivate: [GuardService] },
            { path: 'map', component: UserMapComponent, canActivate: [GuardService] },
            { path: 'requests', component: UserRequestsComponent, canActivate: [GuardService] },
            { path: 'favorites', component: UserFavoritesComponent, canActivate: [GuardService] },
            { path: 'story', component: UserStoriesComponent, canActivate: [GuardService] },
            { path: 'originate', component: UserOriginateComponent, canActivate: [GuardService] },
            { path: 'stories/edit/:key', component: EditStoryComponent, canActivate: [GuardService] },
            { path: 'settings', component: UserSettingsComponent, canActivate: [GuardService] },
            { path: 'changepassword', component: ChangePasswordComponent, canActivate: [GuardService] },
            { path: 'chat', component: ChatComponent, canActivate: [GuardService] }
        ]
    },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' },
]);