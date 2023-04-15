import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private store: Store<fromRoot.State>, private router: Router) {}

  canActivate: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  };

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }
}
