import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
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
// Route Configuration
export const routes: Routes = [
  { path: 'layout', component: LayoutPageComponent },
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'resetpassword', component: PasswordresetPageComponent },
  { path: 'confirmpassword', component: ConfirmpasswordPageComponent },
  { path: 'stories', component: StoriesComponent },
  { path: 'addstory', component: AddStoryComponent },
  { path: 'howitworks', component: HowitworksPageComponent },
  { path: 'mypage', component: MypageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'contact', component: ContactPageComponent },
];

// Deprecated provide
// export const APP_ROUTER_PROVIDERS = [
//   provideRouter(routes)
// ];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);