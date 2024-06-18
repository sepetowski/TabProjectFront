import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../../../core/services/books/books.service';
import { Subscription } from 'rxjs';
import { BookDetails, EditBook } from '../../../interfaces/books.interfaces';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { InputErrorMessageComponent } from '../../../components/input-error-message/input-error-message.component';
import { MessageService } from 'primeng/api';
import { AuthorsService } from '../../../core/services/authors/authors.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Categories } from '../../../interfaces/categories.interfaces';
import { ToggleButtonModule } from 'primeng/togglebutton';

interface Author {
  id: string;
  fullName: string;
}

interface EditBookForm {
  title: FormControl<string>;
  bookDescription: FormControl<string>;
  numberOfPages: FormControl<number>;
  publicationDate: FormControl<Date>;
  availableCopies: FormControl<number>;
  imageFile: FormControl<null | File>;
  categoriesIds: FormControl<{ id: string }[] | null>;
  deleteImage: FormControl<boolean>;
}

@Component({
  selector: 'app-edit-book',
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
    ToggleButtonModule,
  ],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css',
})
export class EditBookComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private booksService = inject(BooksService);
  private messageService = inject(MessageService);
  private categoriesService = inject(CategoriesService);
  private authorsService = inject(AuthorsService);

  private loadingSub: Subscription | null = null;
  private bookSub: Subscription | null = null;
  private messageSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;
  private authorsSub: Subscription | null = null;

  private bookId: string | null = null;

  categories: Categories | null = null;
  authors: Author[] | null = null;

  isLoading: boolean = true;
  book: BookDetails | null = null;

  editBookForm = new FormGroup<EditBookForm>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bookDescription: new FormControl<string>('', {
      nonNullable: true,
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
    deleteImage: new FormControl(false, {
      nonNullable: true,
    }),
  });

  onChangeImage(e: Event) {
    const target = e.target as HTMLInputElement | null;

    if (target && target.files) {
      const file = target.files[0];
      this.editBookForm.patchValue({ imageFile: file });
      this.editBookForm.patchValue({ deleteImage: false });
    }
  }

  onSubmit() {
    if (!this.editBookForm.valid) return;

    const data = this.editBookForm.getRawValue();

    const book: EditBook = {
      title: data.title,
      bookDescription: data.bookDescription,
      numberOfPages: data.numberOfPages,
      publicationDate: data.publicationDate,
      availableCopies: data.availableCopies,
      imageFile: data.imageFile,
      categoriesIds: data.categoriesIds?.map((category) => category.id) || [],
      id: this.book!.id,
      deleteFile: data.deleteImage,
    };

    this.booksService.editBook(book);
  }

  ngOnInit() {
    this.categoriesService.getAllCategories();
    this.authorsService.getAllAuthors();

    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('id');
    });

    if (this.bookId) {
      this.booksService.getBookDetails(this.bookId);
    }

    this.bookSub = this.booksService.bookDetails.subscribe((book) => {
      this.book = book;
      if (!book) return;

      this.editBookForm.patchValue({
        title: book.title,
        bookDescription: book.bookDescripton,
        numberOfPages: book.numberOfPage,
        publicationDate: book.authorDateOfBirth
          ? new Date(book.authorDateOfBirth)
          : new Date(),
        availableCopies: book.availableCopies,
        imageFile: null,
        categoriesIds: book.categories,
        deleteImage: false,
      });
    });

    this.loadingSub = this.booksService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );

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

    this.messageSub = this.booksService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to edit book'
              : 'Edit book successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy() {
    this.bookSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
    this.authorsSub?.unsubscribe();
    this.messageSub?.unsubscribe();
  }
}
