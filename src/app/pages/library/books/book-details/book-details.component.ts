import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BooksService } from '../../../../core/services/books/books.service';
import { ActivatedRoute } from '@angular/router';
import { BookDetails } from '../../../../interfaces/books.interfaces';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ReservationsService } from '../../../../core/services/reservations/reservations.service';
import { LoansService } from '../../../../core/services/loans/loans.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [ProgressSpinnerModule, CommonModule, ButtonModule, TagModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private bookService = inject(BooksService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private reservationService = inject(ReservationsService);
  private loanService = inject(LoansService);

  private bookId: string | null = null;

  private reservationMessageSub: Subscription | null = null;
  private loanMessageSub: Subscription | null = null;
  private loadingSub: Subscription | null = null;
  private bookSubscription: Subscription | null = null;

  isLoading = true;
  book: BookDetails | null = null;

  loanBook() {
    if (this.bookId) this.loanService.createLoan(this.bookId);
  }

  reserveBook() {
    if (this.bookId) this.reservationService.createReservation(this.bookId);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.bookId = params.get('id');
    });

    if (this.bookId) {
      this.bookService.getBookDetails(this.bookId);
    }

    this.bookSubscription = this.bookService.bookDetails.subscribe((book) => {
      this.book = book;
    });

    this.loadingSub = this.bookService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );

    this.reservationMessageSub = this.reservationService.message.subscribe(
      (message) => {
        if (message)
          this.messageService.add({
            severity: message.type,
            summary:
              message.type === 'error'
                ? 'Failed to add reservation'
                : 'Added reservation successful',
            detail: message?.message,
            life: 5000,
          });
      }
    );

    this.loanMessageSub = this.loanService.message.subscribe((message) => {
      if (message)
        this.messageService.add({
          severity: message.type,
          summary:
            message.type === 'error'
              ? 'Failed to make loan'
              : 'Made loan successful',
          detail: message?.message,
          life: 5000,
        });
    });
  }

  ngOnDestroy() {
    this.bookService.resetError();
    this.loanService.resetError();

    this.bookSubscription?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.reservationMessageSub?.unsubscribe();
    this.loanMessageSub?.unsubscribe();
  }
}
