import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';


import { ReactiveFormsModule } from '@angular/forms';
import { Error404Component } from './error404/error404.component';

@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    TabBarComponent,
    HomeComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
