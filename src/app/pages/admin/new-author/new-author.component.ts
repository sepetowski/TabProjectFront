import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputErrorMessageComponent } from '../../../components/input-error-message/input-error-message.component';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { AuthorsService } from '../../../core/services/authors/authors.service';
import { Subscription } from 'rxjs';

interface NewAuthorForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  description: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}

@Component({
  selector: 'app-new-author',
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
    CalendarModule,
  ],
  templateUrl: './new-author.component.html',
  styleUrl: './new-author.component.css',
})
export class NewAuthorComponent implements OnInit, OnDestroy {
  isLoading = false;

  private newAuthorSub: Subscription | null = null;
  private messageSub: Subscription | null = null;

  private messageService = inject(MessageService);
  private authorsService = inject(AuthorsService);

  newAuthorForm = new FormGroup<NewAuthorForm>({
    name: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    surname: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    description: new FormControl(null, {}),
    dateOfBirth: new FormControl(null),
  });

  onSubmit() {
    if (!this.newAuthorForm.valid) return;

    const data = this.newAuthorForm.getRawValue();
    const date = data?.dateOfBirth ? new Date(data.dateOfBirth) : null;
    this.authorsService.createNewAuthor({ ...data, dateOfBirth: date });

    this.newAuthorForm.reset();
  }

  ngOnInit(): void {
    this.newAuthorSub = this.authorsService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.authorsService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to add new Author'
              : 'Added Author successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy(): void {
    this.authorsService.resetError();

    this.newAuthorSub?.unsubscribe();
    this.messageSub?.unsubscribe();
  }
}
