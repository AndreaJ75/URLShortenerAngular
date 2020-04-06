import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UrlManagementComponent } from './url-management/url-management.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    TopBarComponent,
    UrlManagementComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: WelcomePageComponent},
      { path: 'url-management', component: UrlManagementComponent}    // chemin du path correspond à ce qui est saisi dans "route.param" 
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
