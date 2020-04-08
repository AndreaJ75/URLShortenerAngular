import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { UrlManagementComponent } from './components/url-management/url-management.component';
import { LoginComponent } from './components/login/login.component';
import { UrlCreateComponent } from './components/url-create/url-create.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    TopBarComponent,
    UrlManagementComponent,
    LoginComponent,
    UrlCreateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent},
      { path: 'login', component: LoginComponent},
      { path: 'url-create', component: UrlCreateComponent},
      { path: 'url-management', component: UrlManagementComponent}    // chemin du path correspond à ce qui est saisi dans "route.param"
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
