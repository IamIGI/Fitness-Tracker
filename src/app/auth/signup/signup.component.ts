import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { UIService } from 'src/app/shared/ui.service';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'src/app/app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent {
  maxDate: Date = new Date();
  isLoading$ = new Observable();

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromRoot.getIsLoading));

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
