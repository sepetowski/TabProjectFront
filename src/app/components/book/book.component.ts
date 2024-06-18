import { Component, Input, inject } from '@angular/core';
import {
  BookWithCategories,
  BookWithCategoriesAndAuthor,
} from '../../interfaces/books.interfaces';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRole } from '../../interfaces/auth.interfaces';
import { CommonModule, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { BooksService } from '../../core/services/books/books.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CardModule, ButtonModule, NgClass, CommonModule, TagModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  @Input() book!: BookWithCategories;
  @Input() authorName: string | null = null;
  @Input() authorSurname: string | null = null;
  @Input() authorId: string | null = null;

  private authService = inject(AuthService);
  private bookService = inject(BooksService);
  private router = inject(Router);

  private userSub: Subscription | null = null;
  isAdmin = false;

  goToAuthorPage() {
    if (this.authorId)
      this.router.navigate([`/authors/author/${this.authorId}`]);
  }
  delete() {
    if (this.isAdmin) this.bookService.deleteBook(this.book.id);
  }

  goToDetailsPage() {
    // this.router.navigate([`/authors/author/${this.book.id}`]);
  }

  goToEditPage() {
    if (this.isAdmin) this.router.navigate([`admin/edit-book/${this.book.id}`]);
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user && user.role === UserRole.admin) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
