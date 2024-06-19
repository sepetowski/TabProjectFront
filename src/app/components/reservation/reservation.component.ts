import { Component, Input, inject } from '@angular/core';
import { Reservation } from '../../interfaces/reserations.interfaces';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ReservationsService } from '../../core/services/reservations/reservations.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [DatePipe, NgClass, ButtonModule, CommonModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
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
