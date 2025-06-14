import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./views/client/client.module').then(m => m.ClientModule) },
  { path: 'auth', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule) },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
