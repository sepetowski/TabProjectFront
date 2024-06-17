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
import { Categories } from '../../../interfaces/categories.interfaces';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { AuthorsService } from '../../../core/services/authors/authors.service';
import { FileUploadModule } from 'primeng/fileupload';
import { BooksService } from '../../../core/services/books/books.service';
import { AddNewBook } from '../../../interfaces/books.interfaces';

interface Author {
  id: string;
  fullName: string;
}

interface NewBookForm {
  title: FormControl<string>;
  bookDescription: FormControl<string>;
  authorId: FormControl<{ id: string; fullName: string } | null>;
  numberOfPages: FormControl<number>;
  publicationDate: FormControl<Date>;
  availableCopies: FormControl<number>;
  imageFile: FormControl<null | File>;
  categoriesIds: FormControl<{ id: string }[] | null>;
}

@Component({
  selector: 'app-new-book',
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
    InputNumberModule,
    MultiSelectModule,
    ListboxModule,
    FileUploadModule,
  ],
  templateUrl: './new-book.component.html',
  styleUrl: './new-book.component.css',
})
export class NewBookComponent implements OnInit, OnDestroy {
  isLoading = false;

  categories: Categories | null = null;
  authors: Author[] | null = null;

  private loadingSub: Subscription | null = null;
  private messageSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;
  private authorsSub: Subscription | null = null;

  private messageService = inject(MessageService);
  private booksService = inject(BooksService);
  private categoriesService = inject(CategoriesService);
  private authorsService = inject(AuthorsService);

  newBookForm = new FormGroup<NewBookForm>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bookDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    authorId: new FormControl<{ id: string; fullName: string } | null>(null, {
      validators: [Validators.required],
    }),
    numberOfPages: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    publicationDate: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    availableCopies: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    imageFile: new FormControl<null | File>(null),
    categoriesIds: new FormControl<{ id: string }[] | null>(null),
  });

  onChangeImage(e: Event) {
    const target = e.target as HTMLInputElement | null;

    if (target && target.files) {
      const file = target.files[0];
      this.newBookForm.patchValue({ imageFile: file });
    }
  }

  onSubmit() {
    if (!this.newBookForm.valid) return;

    const data = this.newBookForm.getRawValue();

    const book: AddNewBook = {
      title: data.title,
      bookDescription: data.bookDescription,
      authorId: data.authorId!.id,
      numberOfPages: data.numberOfPages,
      publicationDate: data.publicationDate,
      availableCopies: data.availableCopies,
      imageFile: data.imageFile,
      categoriesIds: data.categoriesIds?.map((category) => category.id) || [],
    };

    this.booksService.createNewBook(book);

    this.newBookForm.reset();
    this.newBookForm.patchValue({ imageFile: null });
  }

  ngOnInit(): void {
    this.categoriesService.getAllCategories();
    this.authorsService.getAllAuthors();

    this.categoriesSub = this.categoriesService.categories.subscribe(
      (categories) => {
        console.log(categories);
        this.categories = categories;
      }
    );

    this.authorsSub = this.authorsService.authors.subscribe((authors) => {
      if (authors) {
        this.authors = authors.authors.map((author) => ({
          id: author.id,
          fullName: `${author.name} ${author.surname}`,
        }));
      } else {
        this.authors = null;
      }
    });

    this.loadingSub = this.booksService.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.messageSub = this.booksService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to add new Book'
              : 'Added book successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
    this.authorsSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.messageSub?.unsubscribe();
  }
}
