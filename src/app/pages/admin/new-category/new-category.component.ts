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
import { CategoriesService } from '../../../core/services/categories/categories.service';

interface NewCategoryForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-new-category',
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
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css',
})
export class NewCategoryComponent implements OnInit, OnDestroy {
  isLoading = false;

  private loadingSub: Subscription | null = null;
  private messageSub: Subscription | null = null;

  private categoriesService = inject(CategoriesService);
  private messageService = inject(MessageService);

  newCategoryForm = new FormGroup<NewCategoryForm>({
    name: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (!this.newCategoryForm.valid) return;

    const data = this.newCategoryForm.getRawValue();

    this.categoriesService.createNewCategory(data);

    this.newCategoryForm.reset();
  }

  ngOnInit(): void {
    this.loadingSub = this.categoriesService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.categoriesService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to add new category'
              : 'Added category successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy(): void {
    this.categoriesService.resetError();

    this.loadingSub?.unsubscribe();
    this.messageSub?.unsubscribe();
  }
}
