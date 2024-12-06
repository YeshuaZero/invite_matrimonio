import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadComponent: () => import('./public/inicio.component').then(c => c.InicioComponent) },
  { path: ':id', loadComponent: () => import('./public/inicio.component').then(c => c.InicioComponent) },

  // REDIRECCIONAMIENTOS 
  { path: '**', redirectTo: '/404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
