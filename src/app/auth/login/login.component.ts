import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

import { AuthData } from '../auth-data.model';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading$ = new Observable<boolean>();

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoading));
    this.loginForm = new FormGroup({
      emailField: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      passwordField: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    const authData: AuthData = {
      email: this.loginForm.value.emailField,
      password: this.loginForm.value.passwordField,
    };
    this.authService.login(authData).finally(() => {
      this.loginForm.reset();
    });
  }
}
