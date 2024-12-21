import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './private/panel/panel.component';
import { PRIVATE_ROUTING } from './private-routing.routing';
import { authGuard } from './core/auth.guard';

const routes: Routes = [
  { path: '', loadComponent: () => import('./public/inicio.component').then(c => c.InicioComponent) },
  { path: 'boda/:id', loadComponent: () => import('./public/web-bodas/web-bodas.component').then(c => c.WebBodasComponent) },
  { path: 'wedding/:id', loadComponent: () => import('./public/web-bodas/web-bodas.component').then(c => c.WebBodasComponent) },

  {
    path: 'panel',
    data: { nombre: 'Panel' },
    component: PanelComponent,
    children: PRIVATE_ROUTING,
    canActivate: [authGuard]
  },

  // REDIRECCIONAMIENTOS 
  { path: '**', redirectTo: '/404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
