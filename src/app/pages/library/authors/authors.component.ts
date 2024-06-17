import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthorsService } from '../../../core/services/authors/authors.service';
import { Author, AuthorsList } from '../../../interfaces/authors.interfaces';
import { AuthorComponent } from '../../../components/author/author.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    AuthorComponent,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent implements OnInit, OnDestroy {
  isLoading = false;
  authors: AuthorsList | null = null;
  filteredAuthors: Author[] | null = null;

  serachValue: string = '';

  private _authorsSub: Subscription | null = null;
  private _loadingSub: Subscription | null = null;

  private _authorsService = inject(AuthorsService);

  filterAuthors() {
    if (this.authors) {
      const searchTerm = this.serachValue.toLowerCase().trim();

      this.filteredAuthors = this.authors.authors.filter((author) => {
        const fullName = `${author.name} ${author.surname}`
          .toLowerCase()
          .trim();
        return fullName.includes(searchTerm);
      });
    }
  }

  ngOnInit() {
    this._authorsSub = this._authorsService.authors.subscribe((authors) => {
      this.authors = authors;
      if (authors) {
        this.filteredAuthors = authors.authors;
        this.filterAuthors();
      }
    });
    this._authorsService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );

    this._authorsService.getAllAuthors();
  }
  ngOnDestroy() {
    this._authorsSub?.unsubscribe();
    this._loadingSub?.unsubscribe();
  }
}
