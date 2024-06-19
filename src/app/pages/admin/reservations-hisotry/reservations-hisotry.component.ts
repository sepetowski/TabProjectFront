import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BookComponent } from '../../../components/book/book.component';
import { Subscription } from 'rxjs';
import {
  Reservation,
  Reservations,
} from '../../../interfaces/reserations.interfaces';
import { ReservationsService } from '../../../core/services/reservations/reservations.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserInfo, UsersInfo } from '../../../interfaces/auth.interfaces';
import { ReservationAdminCardComponent } from '../../../components/reservation-admin-card/reservation-admin-card.component';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-reservations-hisotry',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ProgressSpinnerModule,
    BookComponent,
    MultiSelectModule,
    ReservationAdminCardComponent,
    SelectButtonModule,
  ],
  templateUrl: './reservations-hisotry.component.html',
  styleUrl: './reservations-hisotry.component.css',
})
export class ReservationsHisotryComponent implements OnInit, OnDestroy {
  private loadingSub: Subscription | null = null;
  private reservationSub: Subscription | null = null;
  private usersSub: Subscription | null = null;

  private reservationService = inject(ReservationsService);
  private authService = inject(AuthService);

  serachValue = '';
  isLoading = true;
  reservations: Reservations | null = null;
  filteredReservations: Reservation[] = [];
  users: UserInfo[] = [];
  selectedUsers: UserInfo[] = [];

  stateOptions = [
    { label: 'All', value: 'all' },
    { label: 'Only active', value: 'not-returned' },
  ];

  value: string = 'all';

  filter() {
    if (this.reservations) {
      const searchTerm = this.serachValue.toLowerCase().trim();

      this.filteredReservations = this.reservations.reservations.filter(
        (res) => {
          const title = res.bookTitle.toLowerCase().trim();
          const matchesTitle = title.includes(searchTerm);

          const matchesAccounts =
            this.selectedUsers.length === 0 ||
            this.selectedUsers.some((user) => user.id === res.userId);

          const matchesReturnStatus =
            this.value === 'all' ||
            (this.value === 'not-returned' && res.isActive);

          return matchesTitle && matchesAccounts && matchesReturnStatus;
        }
      );
    }
  }

  ngOnInit() {
    this.authService.getAllUsers();
    this.reservationService.getAllReservations();

    this.usersSub = this.authService.users.subscribe((users) => {
      if (users) this.users = users.users;
      console.log(users);
    });

    this.reservationSub = this.reservationService.reservations.subscribe(
      (reservations) => {
        this.reservations = reservations;
        if (reservations) {
          this.filteredReservations = reservations.reservations;
          this.filter();
        }
      }
    );

    this.loadingSub = this.reservationService.isLoading.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
  }
  ngOnDestroy() {
    this.reservationSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
    this.usersSub?.unsubscribe();
  }
}
