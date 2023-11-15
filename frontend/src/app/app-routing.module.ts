import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { PublicProfileComponent } from './public-profile/public-profile.component';
import { UserDirectoryComponent } from './user-directory/user-directory.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HomeComponent } from './home/home.component';
import { UserMapComponent } from './user-map/user-map.component';
import { EmergencyListComponent } from './emergency-list/emergency-list.component';

const routes: Routes = [
  /*{
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },*/
  {
    path: '',
    pathMatch: 'full',
    component: UserListComponent,
  },
  {
    path: 'emergency-list',
    pathMatch: 'full',
    component: EmergencyListComponent,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'me',
    pathMatch: 'full',
    component: UserAccountComponent,
  },
  {
    path: 'minions/:id',
    pathMatch: 'full',
    component: PublicProfileComponent,
  },
  {
    path: 'minions/:id/edit',
    pathMatch: 'full',
    component: UserAccountComponent,
  },
  {
    path: 'minions',
    pathMatch: 'full',
    component: UserDirectoryComponent,
  },
  {
    path: 'settings',
    pathMatch: 'full',
    component: SettingsComponent,
  },
  {
    path: 'statistic',
    pathMatch: 'full',
    component: StatisticsComponent,
  },
  {
    path: 'map',
    pathMatch: 'full',
    component: UserMapComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
