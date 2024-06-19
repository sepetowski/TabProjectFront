import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookComponent } from '../../../components/book/book.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserInfo } from '../../../interfaces/auth.interfaces';

import { LoansService } from '../../../core/services/loans/loans.service';
import { Loan, Loans } from '../../../interfaces/loans.interface';
import { LoanAdminCardComponent } from '../../../components/loan-admin-card/loan-admin-card.component';
import { SelectButtonModule } from 'primeng/selectbutton';
@Component({
  selector: 'app-loans-hisotry',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ProgressSpinnerModule,
    BookComponent,
    MultiSelectModule,
    LoanAdminCardComponent,
    SelectButtonModule,
  ],
  templateUrl: './loans-hisotry.component.html',
  styleUrl: './loans-hisotry.component.css',
})
export class LoansHisotryComponent implements OnInit, OnDestroy {
  private loadingSub: Subscription | null = null;
  private loansSub: Subscription | null = null;
  private usersSub: Subscription | null = null;

  private loansService = inject(LoansService);
  private authService = inject(AuthService);

  serachValue = '';
  isLoading = true;
  loans: Loans | null = null;
  filteredLoans: Loan[] = [];
  users: UserInfo[] = [];
  selectedUsers: UserInfo[] = [];

  stateOptions = [
    { label: 'All', value: 'all' },
    { label: 'Only not returned', value: 'not-returned' },
  ];

  value: string = 'all';

  filter() {
    if (this.loans) {
      const searchTerm = this.serachValue.toLowerCase().trim();

      this.filteredLoans = this.loans.loans.filter((res) => {
        const title = res.bookTitle.toLowerCase().trim();
        const matchesTitle = title.includes(searchTerm);

        const matchesAccounts =
          this.selectedUsers.length === 0 ||
          this.selectedUsers.some((user) => user.id === res.userId);

        const matchesReturnStatus =
          this.value === 'all' ||
          (this.value === 'not-returned' && !res.returnDate);

        return matchesTitle && matchesAccounts && matchesReturnStatus;
      });
    }
  }

  ngOnInit() {
    this.authService.getAllUsers();
    this.loansService.getAllLoans();

    this.usersSub = this.authService.users.subscribe((users) => {
      if (users) this.users = users.users;
      console.log(users);
    });

    this.loadingSub = this.loansService.loans.subscribe((loans) => {
      this.loans = loans;
      if (loans) {
        this.filteredLoans = loans.loans;
        this.filter();
      }
    });

    this.loadingSub = this.loansService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
  ngOnDestroy() {
    this.loansSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.usersSub?.unsubscribe();
  }
}
