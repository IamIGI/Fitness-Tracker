import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent {
  maxDate: Date = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); //get 18 years ago date
  }

  onSubmit(form: NgForm) {
    const newUserObject: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };
    this.authService.registerUser(newUserObject);
  }
}
