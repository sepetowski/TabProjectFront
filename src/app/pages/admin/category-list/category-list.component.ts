import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Subscription } from 'rxjs';
import { Category } from '../../../interfaces/categories.interfaces';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CategoryInfoComponent } from '../../../components/category-info/category-info.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [ProgressSpinnerModule, CategoryInfoComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit, OnDestroy {
  private categoriesService = inject(CategoriesService);

  private loadingSub: Subscription | null = null;
  private categoriesSub: Subscription | null = null;

  isLoading = true;

  categories: Category[] = [];

  ngOnInit() {
    this.categoriesService.getAllCategories();

    this.categoriesSub = this.categoriesService.categories.subscribe(
      (categories) => {
        if (categories?.categories) this.categories = categories.categories;
      }
    );

    this.loadingSub = this.categoriesService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );
  }
  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
}
