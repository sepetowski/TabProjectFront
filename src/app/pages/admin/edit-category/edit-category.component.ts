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
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Category } from '../../../interfaces/categories.interfaces';

interface EditCategoryForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-edit-category',
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
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css',
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  isLoading = true;
  categoryId: string | null = null;

  private loadingSub: Subscription | null = null;
  private messageSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;

  private categoriesService = inject(CategoriesService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);

  editCategoryForm = new FormGroup<EditCategoryForm>({
    name: new FormControl('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  onSubmit() {
    if (!this.editCategoryForm.valid) return;

    const data = this.editCategoryForm.getRawValue();

    if (this.categoryId)
      this.categoriesService.updateCategory(this.categoryId, data);
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategories();

    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('id');
    });

    this.categoriesSub = this.categoriesService.categories.subscribe(
      (categories) => {
        if (this.categoryId && categories?.categories) {
          const category = categories.categories.find(
            (category) => category.id === this.categoryId
          );

          this.editCategoryForm.patchValue({
            name: category?.name,
          });
        }
      }
    );

    this.loadingSub = this.categoriesService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.categoriesService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to edit category'
              : 'Edited category successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy(): void {
    this.categoriesService.resetError();

    this.loadingSub?.unsubscribe();
    this.messageSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
  }
}
