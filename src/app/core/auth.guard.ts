import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FuncionesGeneralesService } from './funciones-generales.services';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(FuncionesGeneralesService);
    const dataExiste = !!authService.getData('t0k3nD4v1dk4');
    return dataExiste ? true : inject(Router).createUrlTree(['']);
};