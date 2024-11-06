import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../servicio/auth/auth.service';

// Definición del guard `loginGuard` utilizando la función `CanActivateFn`.
// Este guard se asegura de que solo los usuarios autenticados puedan acceder a ciertas rutas.
export const loginGuard: CanActivateFn = (route, state) => {

  // Utiliza `inject` para obtener una instancia del servicio de autenticación (AuthService).
  const authIn = inject(AuthService) as AuthService;

  // Utiliza `inject` para obtener una instancia del enrutador de Angular (Router).
  const router = inject(Router) as Router;

  // Comprueba si el usuario no tiene un token de acceso (no está autenticado).
  if (authIn.accessToken == null) {

    // Si no está autenticado (accessToken es nulo), redirige al usuario a la página de inicio o de login.
    router.navigate(['/']);

    // Retorna `false` para bloquear el acceso a la ruta que el usuario intentaba acceder.
    return false;
  }

  // Si el usuario está autenticado (tiene un accessToken), permite el acceso a la ruta.
  return true;
};
