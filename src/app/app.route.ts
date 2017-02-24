import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from './service/guard.service';

import { HomeComponent } from './page/home/home.component';
import { CreateComponent } from './page/create/create.component';
import { StoriesComponent } from './page/stories/stories.component';
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

export const Route: ModuleWithProviders = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'create', component: CreateComponent },
    { path: 'stories', component: StoriesComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'work', component: WorkComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'resetpassword', component: PasswordresetComponent },
    { path: 'confirmpassword', component: PasswordconfirmComponent },
    {
        path: 'profile', component: DashboardComponent, canActivate: [GuardService], children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: UserHomeComponent, canActivate: [GuardService] },
            { path: 'friends', component: UserFriendsComponent, canActivate: [GuardService] },
            { path: 'favorites', component: UserFavoritesComponent, canActivate: [GuardService] },
            { path: 'stories', component: UserStoriesComponent, canActivate: [GuardService] },
            { path: 'settings', component: UserSettingsComponent, canActivate: [GuardService] },
            { path: 'changepassword', component: ChangePasswordComponent, canActivate: [GuardService] }
        ]
    },
]);


