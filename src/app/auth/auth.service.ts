import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        //auth successful
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        //logout
        this.trainingService.clearFirestoreSubscription();
        this.isAuthenticated = false;
        this.authChange.next(false); //false means you are logout
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((response) => {})
      .catch((err: Error) =>
        this.snackBar.open(err.message, undefined, {
          duration: 3000,
        })
      )
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      });
  }

  async login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((response) => {})
      .catch((err: Error) => {
        this.snackBar.open(err.message, undefined, {
          duration: 3000,
        });
      })
      .finally(() => {
        this.uiService.loadingStateChanged.next(false);
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
