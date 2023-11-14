import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';
import { UserListComponent } from './user-list/user-list.component';
import { from } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserAccountComponent } from './user-account/user-account.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatRippleModule } from '@angular/material/core';
import { QuickUserInfoComponent } from './quick-user-info/quick-user-info.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { UserDirectoryComponent } from './user-directory/user-directory.component';
import { SettingsComponent } from './settings/settings.component';
import {MatChipsModule} from '@angular/material/chips';
import { StatisticsComponent } from './statistics/statistics.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HomeComponent } from './home/home.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { UserMapComponent } from './user-map/user-map.component';
import { EmergencyListComponent } from './emergency-list/emergency-list.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    LoginComponent,
    UserAccountComponent,
    SidenavComponent,
    QuickUserInfoComponent,
    PublicProfileComponent,
    UserDirectoryComponent,
    SettingsComponent,
    StatisticsComponent,
    HomeComponent,
    UserMapComponent,
    EmergencyListComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    FormsModule,
    MatSnackBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
