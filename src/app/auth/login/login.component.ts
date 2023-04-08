import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      emailField: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      passwordField: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    const authData: AuthData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.login(authData);
  }
}
