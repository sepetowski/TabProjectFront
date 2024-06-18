import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UserRole } from '../../interfaces/auth.interfaces';
import { Category } from '../../interfaces/categories.interfaces';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CategoriesService } from '../../core/services/categories/categories.service';

@Component({
  selector: 'app-category-info',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './category-info.component.html',
  styleUrl: './category-info.component.css',
})
export class CategoryInfoComponent implements OnInit, OnDestroy {
  @Input() category!: Category;
  private authService = inject(AuthService);
  private categoriesService = inject(CategoriesService);
  private router = inject(Router);

  private userSub: Subscription | null = null;
  isAdmin = false;

  delete() {
    if (this.isAdmin) this.categoriesService.deleteCategory(this.category.id);
  }

  goToEditPage() {
    if (this.isAdmin)
      this.router.navigate([`admin/edit-category/${this.category.id}`]);
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
