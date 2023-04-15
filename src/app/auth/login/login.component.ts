import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

import { AuthData } from '../auth-data.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoading = false;
  private loadingSubs = new Subscription();

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      (loadingState) => (this.isLoading = loadingState)
    );
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

  ngOnDestroy() {
    if (this.loadingSubs) this.loadingSubs.unsubscribe();
  }
}
