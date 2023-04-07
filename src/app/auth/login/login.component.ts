import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      emailField: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      passwordField: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }
}
