import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subscription } from 'rxjs';
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../../../constants/contsatnts';
import { AuthService } from '../../../core/services/auth/auth.service';
import { validatePassword } from '../../../validators/password.validator';
import { InputErrorMessageComponent } from '../../../components/input-error-message/input-error-message.component';

interface SignInForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    InputErrorMessageComponent,
  ],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit, OnDestroy {
  isLoading = false;
  errorMessage: null | string = null;
  private loginSub: Subscription | null = null;
  private messageSub: Subscription | null = null;
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  signInForm = new FormGroup<SignInForm>({
    username: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(MIN_USERNAME_LENGTH),
        Validators.maxLength(MAX_USERNAME_LENGTH),
      ],
      nonNullable: true,
    }),
    password: new FormControl('', {
      validators: [Validators.required, validatePassword],
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (!this.signInForm.valid) return;
    this.authService.signIn(this.signInForm.getRawValue());
    this.signInForm.reset();
  }

  ngOnInit(): void {
    this.loginSub = this.authService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.authService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to sign in'
              : 'Sign in successful',
          detail: message.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy(): void {
    this.authService.resetError();

    this.loginSub?.unsubscribe();
    this.messageSub?.unsubscribe();
  }
}
