import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        //auth successful
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        //logout
        this.trainingService.clearFirestoreSubscription();
        this.store.dispatch(new Auth.SetUnAuthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((response) => {})
      .catch((err: Error) =>
        this.uiService.showSnackbar(err.message, undefined, 3000)
      )
      .finally(() => {
        this.store.dispatch(new UI.StopLoading());
      });
  }

  async login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((response) => {})
      .catch((err: Error) => {
        this.uiService.showSnackbar(err.message, undefined, 3000);
      })
      .finally(() => {
        this.store.dispatch(new UI.StopLoading());
      });
  }

  logout() {
    this.afAuth.signOut();
  }
}
