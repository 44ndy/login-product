import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loginGuard } from './guard/login.guard';


const routes: Routes = [


  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },

  // Ruta para la página de inicio de sesión.
  {
    path: 'iniciar-sesion',
    loadChildren: () => import('./iniciar-sesion/iniciar-sesion.module').then(m => m.IniciarSesionPageModule)

  },


  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then(m => m.ProductosPageModule),


    // Guarda que protege el acceso a la página de productos.
    canActivate: [loginGuard] // Aplica el guard 'loginGuard' para proteger esta ruta.
  },
];

@NgModule({
  imports: [

    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
