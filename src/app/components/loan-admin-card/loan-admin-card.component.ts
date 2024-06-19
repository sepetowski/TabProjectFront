import { Component, Input, inject } from '@angular/core';
import { Loan } from '../../interfaces/loans.interface';
import { LoansService } from '../../core/services/loans/loans.service';
import { Router } from '@angular/router';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-loan-admin-card',
  standalone: true,
  imports: [DatePipe, NgClass, ButtonModule, CommonModule],
  templateUrl: './loan-admin-card.component.html',
  styleUrl: './loan-admin-card.component.css',
})
export class LoanAdminCardComponent {
  @Input() loan!: Loan;

  private laonsService = inject(LoansService);
  private router = inject(Router);

  goToBookDetails() {
    this.router.navigate([`/book/${this.loan.bookId}`]);
  }

  returnLoan() {
    this.laonsService.returnLoan(this.loan.id);
  }
}
