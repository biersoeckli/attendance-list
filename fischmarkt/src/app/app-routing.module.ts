import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanActivateAuthenticated } from './guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [CanActivateAuthenticated]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'antrag',
    loadChildren: () => import('./antrag-edit/antrag-edit.module').then( m => m.AntragEditPageModule),
    canActivate: [CanActivateAuthenticated]
  },
  {
    path: 'fish-detail/:fishTypeId',
    loadChildren: () => import('./fish-detail/fish-detail.module').then( m => m.FishDetailPageModule),
    canActivate: [CanActivateAuthenticated]
  },
  {
    path: 'ranking',
    loadChildren: () => import('./ranking/ranking.module').then( m => m.RankingPageModule),
    canActivate: [CanActivateAuthenticated]
  },
  {
    path: 'decision-board',
    loadChildren: () => import('./decision-board/decision-board.module').then( m => m.DecisionBoardPageModule),
    canActivate: [CanActivateAuthenticated]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
