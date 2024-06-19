import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReservationComponent } from '../../../components/reservation/reservation.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserRole } from '../../../interfaces/auth.interfaces';
import { User } from '../../../models/user.model';
import { LoansService } from '../../../core/services/loans/loans.service';
import { Loans } from '../../../interfaces/loans.interface';
import { LoanComponent } from '../../../components/loan/loan.component';

@Component({
  selector: 'app-my-loans',
  standalone: true,
  imports: [ProgressSpinnerModule, ReservationComponent, LoanComponent],
  templateUrl: './my-loans.component.html',
  styleUrl: './my-loans.component.css',
})
export class MyLoansComponent implements OnInit, OnDestroy {
  private loadingSub: Subscription | null = null;
  private userSub: Subscription | null = null;
  private loanSub: Subscription | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private loanSerive = inject(LoansService);

  loans: Loans | null = null;
  isLoading = true;
  user: User | null = null;

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;

      if (user) {
        if (user.role === UserRole.admin) this.router.navigate(['/']);
        else this.loanSerive.getUserLoans(user.id);
      }
    });

    this.loanSub = this.loanSerive.loans.subscribe(
      (loans) => (this.loans = loans)
    );

    this.loadingSub = this.loanSerive.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
  }

  ngOnDestroy() {
    this.loanSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
