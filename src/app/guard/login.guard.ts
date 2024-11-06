import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../servicio/auth/auth.service';


export const loginGuard: CanActivateFn = (route, state) => {
  const authIn = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  if(authIn.accessToken==null){
      router.navigate(['/']);
      return false;

  }

  return true;
};
