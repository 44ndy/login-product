import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loginGuard } from './guard/login.guard';
const routes: Routes = [

  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./iniciar-sesion/iniciar-sesion.module').then( m => m.IniciarSesionPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule),
    canActivate:[loginGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
