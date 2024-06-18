import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Author } from '../../interfaces/authors.interfaces';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../interfaces/auth.interfaces';
import { Router } from '@angular/router';
import { AuthorsService } from '../../core/services/authors/authors.service';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [DatePipe, CardModule, ButtonModule, ScrollPanelModule],
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
})
export class AuthorComponent implements OnInit, OnDestroy {
  @Input() author!: Author;

  private authService = inject(AuthService);
  private authorsService = inject(AuthorsService);
  private router = inject(Router);

  private userSub: Subscription | null = null;
  isAdmin = false;

  goToDetailsPage() {
    this.router.navigate([`/authors/author/${this.author.id}`]);
  }
  delete() {
    if (this.isAdmin) this.authorsService.deleteAuthor(this.author.id);
  }

  goToEditPage() {
    if (this.isAdmin)
      this.router.navigate([`admin/edit-author/${this.author.id}`]);
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
