import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BooksService } from '../../../core/services/books/books.service';
import {
  AllBooks,
  BookWithCategoriesAndAuthor,
} from '../../../interfaces/books.interfaces';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookComponent } from '../../../components/book/book.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { Category } from '../../../interfaces/categories.interfaces';
import { CategoriesService } from '../../../core/services/categories/categories.service';
@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ProgressSpinnerModule,
    BookComponent,
    MultiSelectModule,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, OnDestroy {
  private loadingSub: Subscription | null = null;
  private bookSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;

  private booksService = inject(BooksService);
  private categoriesService = inject(CategoriesService);

  serachValue: string = '';
  isLoading = true;

  categories: Category[] = [];
  selectedCategories: Category[] = [];
  books: AllBooks | null = null;
  filteredBooks: BookWithCategoriesAndAuthor[] = [];

  filterBooks() {
    if (this.books) {
      const searchTerm = this.serachValue.toLowerCase().trim();

      this.filteredBooks = this.books.books.filter((book) => {
        const title = book.title.toLowerCase().trim();
        const matchesTitle = title.includes(searchTerm);

        const matchesCategories =
          this.selectedCategories.length === 0 ||
          book.categories.some((cat) =>
            this.selectedCategories.some((selCat) => selCat.id === cat.id)
          );

        return matchesTitle && matchesCategories;
      });
    }
  }

  ngOnInit() {
    this.categoriesService.getAllCategories();

    this.categoriesSub = this.categoriesService.categories.subscribe(
      (categories) => {
        if (categories) this.categories = categories?.categories;
      }
    );

    this.bookSub = this.booksService.allBooks.subscribe((books) => {
      this.books = books;
      if (books) {
        this.filteredBooks = books.books;
        this.filterBooks();
      }
    });
    this.booksService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );

    this.booksService.getAllBooks();
  }
  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
    this.bookSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
