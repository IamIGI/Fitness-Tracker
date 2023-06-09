import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// import { provideAuth, getAuth } from '@angular/fire/auth';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    // provideAuth(() => getAuth()),
    AuthRoutingModule,
  ],
  exports: [],
})
export class AuthModule {}
