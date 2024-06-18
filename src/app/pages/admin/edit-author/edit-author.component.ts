import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputErrorMessageComponent } from '../../../components/input-error-message/input-error-message.component';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthorsService } from '../../../core/services/authors/authors.service';

interface EditAuthorForm {
  name: FormControl<string>;
  surname: FormControl<string>;
  description: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}

@Component({
  selector: 'app-edit-author',
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
  templateUrl: './edit-author.component.html',
  styleUrl: './edit-author.component.css',
})
export class EditAuthorComponent implements OnInit, OnDestroy {
  isLoading = false;

  private authorId: string | null = null;
  private loadingSub: Subscription | null = null;
  private messageSub: Subscription | null = null;
  private authorSub: Subscription | null = null;

  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private authorsService = inject(AuthorsService);

  editAuthorForm = new FormGroup<EditAuthorForm>({
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
    if (!this.editAuthorForm.valid) return;

    const data = this.editAuthorForm.getRawValue();
    const date = data?.dateOfBirth ? new Date(data.dateOfBirth) : null;

    if (this.authorId)
      this.authorsService.updateAuthor(this.authorId, {
        ...data,
        dateOfBirth: date,
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.authorId = params.get('id');
    });

    if (this.authorId) this.authorsService.getAuthorsDetails(this.authorId);

    this.loadingSub = this.authorsService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.authorsService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to edit author'
              : 'Edited Author successful',
          detail: message?.message,
          life: 5000,
        });
    });

    this.authorSub = this.authorsService.authorDetails.subscribe((author) => {
      if (author)
        this.editAuthorForm.patchValue({
          name: author.name,
          surname: author.surname,
          description: author.description,
          dateOfBirth: author.dateOfBirth ? new Date(author.dateOfBirth) : null,
        });
    });
  }

  ngOnDestroy(): void {
    this.authorsService.resetError();

    this.loadingSub?.unsubscribe();
    this.messageSub?.unsubscribe();
    this.authorSub?.unsubscribe();
  }
}
