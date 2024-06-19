import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ReservationsService } from '../../../core/services/reservations/reservations.service';
import { Reservations } from '../../../interfaces/reserations.interfaces';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../interfaces/auth.interfaces';
import { ReservationComponent } from '../../../components/reservation/reservation.component';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [ProgressSpinnerModule, ReservationComponent],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css',
})
export class MyReservationsComponent implements OnInit, OnDestroy {
  private loadingSub: Subscription | null = null;
  private userSub: Subscription | null = null;
  private reservationSub: Subscription | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private reservationsSerive = inject(ReservationsService);

  reservations: Reservations | null = null;
  isLoading = true;
  user: User | null = null;

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;

      if (user) {
        if (user.role === UserRole.admin) this.router.navigate(['/']);
        else this.reservationsSerive.getUserReservations(user.id);
      }
    });

    this.reservationSub = this.reservationsSerive.reservations.subscribe(
      (reservations) => (this.reservations = reservations)
    );

    this.loadingSub = this.reservationsSerive.isLoading.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
  }

  ngOnDestroy() {
    this.reservationSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
