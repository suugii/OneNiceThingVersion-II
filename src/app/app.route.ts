import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './providers/auth-guard.service';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { PasswordresetPageComponent } from './pages/passwordreset-page/passwordreset-page.component';
import { ConfirmpasswordPageComponent } from './pages/confirmpassword-page/confirmpassword-page.component';
import { AddStoryComponent } from './pages/add-story/add-story.component';
import { StoriesComponent } from './pages/stories/stories.component';
import { HowitworksPageComponent } from './pages/howitworks-page/howitworks-page.component';
import { MypageComponent } from './pages/mypage/mypage.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { MystoriesComponent } from './pages/mystories/mystories.component';
import { MyfriendsComponent } from './pages/myfriends/myfriends.component';
import { MyfavoritesComponent } from './pages/myfavorites/myfavorites.component';
import { MydashboardComponent } from './pages/mydashboard/mydashboard.component';
// Route Configuration
export const routes: Routes = [
    { path: '', component: HomePageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'resetpassword', component: PasswordresetPageComponent },
    { path: 'confirmpassword', component: ConfirmpasswordPageComponent },
    { path: 'howitworks', component: HowitworksPageComponent },

    { path: 'stories', component: StoriesComponent },
    { path: 'create/story', component: AddStoryComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'profile', component: MypageComponent, canActivate: [AuthGuardService], children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: MydashboardComponent, canActivate: [AuthGuardService] },
            { path: 'friends', component: MyfriendsComponent, canActivate: [AuthGuardService] },
            { path: 'favorites', component: MyfavoritesComponent, canActivate: [AuthGuardService] },
            { path: 'stories', component: MystoriesComponent, canActivate: [AuthGuardService] }
        ]
    },
];


// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes), AuthGuardService
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);