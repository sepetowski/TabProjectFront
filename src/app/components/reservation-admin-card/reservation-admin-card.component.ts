import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations/reservations.service';
import { Reservation } from '../../interfaces/reserations.interfaces';
import { DatePipe, NgClass, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-reservation-admin-card',
  standalone: true,
  imports: [DatePipe, NgClass, ButtonModule, CommonModule],
  templateUrl: './reservation-admin-card.component.html',
  styleUrl: './reservation-admin-card.component.css',
})
export class ReservationAdminCardComponent {
  @Input() reservation!: Reservation;

  private reservationsService = inject(ReservationsService);
  private router = inject(Router);

  goToBookDetails() {
    this.router.navigate([`/book/${this.reservation.bookId}`]);
  }

  cancelReservation() {
    this.reservationsService.cancelReservation(this.reservation.id);
  }
}
