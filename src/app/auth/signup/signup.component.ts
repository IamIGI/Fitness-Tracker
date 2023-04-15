import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent {
  maxDate: Date = new Date();
  isLoading = false;
  private loadingSubs = new Subscription();

  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      (loadingState) => (this.isLoading = loadingState)
    );

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
