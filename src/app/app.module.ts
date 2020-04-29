import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { UrlLinkComponent } from './components/urlLink/urlLink.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LoginComponent } from './components/login/login.component';
import {TokenInterceptor} from './interceptors/token-interceptor';
import { MyAdminIfDirective } from './custom-directives/admin-directive';
import { UserManagementComponent } from './components/user-management/user-management.component';
import {PagerService} from './services/pager.service';
import { HomePageComponent } from './components/home/homePage.component';
import { UrlUpdateComponent } from './components/url-update/url-update.component';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UrlLinkComponent,
    TopBarComponent,
    LoginComponent,
    MyAdminIfDirective,
    UserManagementComponent,
    HomePageComponent,
    UrlUpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent},
      { path: 'my-url-links', component: UrlLinkComponent},
      { path: 'login', component: LoginComponent},
      { path: 'url-update/:urlInd' , component: UrlUpdateComponent},
      { path: 'user-management', component: UserManagementComponent}
    ])
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    PagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
