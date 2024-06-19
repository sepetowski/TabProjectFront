import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LoansService } from '../../core/services/loans/loans.service';
import { Router } from '@angular/router';
import { Loan } from '../../interfaces/loans.interface';

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [DatePipe, NgClass, ButtonModule, CommonModule],
  templateUrl: './loan.component.html',
  styleUrl: './loan.component.css',
})
export class LoanComponent implements OnInit {
  @Input() loan!: Loan;

  private loansService = inject(LoansService);
  private router = inject(Router);

  ngOnInit(): void {
    console.log(this.loan);
  }

  goToBookDetails() {
    this.router.navigate([`/book/${this.loan.bookId}`]);
  }

  returnLoan() {
    this.loansService.returnLoan(this.loan.id);
  }
}
