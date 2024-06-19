import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AuthorsService } from '../../../../core/services/authors/authors.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorDetails } from '../../../../interfaces/authors.interfaces';
import { Subscription } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePipe } from '@angular/common';
import { BookComponent } from '../../../../components/book/book.component';

@Component({
  selector: 'app-author-details',
  standalone: true,
  imports: [ProgressSpinnerModule, DatePipe, BookComponent],
  templateUrl: './author-details.component.html',
  styleUrl: './author-details.component.css',
})
export class AuthorDetailsComponent implements OnInit, OnDestroy {
  private _authorsService = inject(AuthorsService);
  private _route = inject(ActivatedRoute);

  private _loadingSub: Subscription | null = null;
  private _authorDetailsSub: Subscription | null = null;

  private _authorId: string | null = null;

  isLoading: boolean = true;
  author: AuthorDetails | null = null;

  ngOnInit() {
    this._route.paramMap.subscribe((params) => {
      this._authorId = params.get('id');
    });

    if (this._authorId) {
      this._authorsService.getAuthorsDetails(this._authorId);
    }

    this._authorDetailsSub = this._authorsService.authorDetails.subscribe(
      (author) => {
        this.author = author;
      }
    );

    this._loadingSub = this._authorsService.isLoading.subscribe(
      (laoding) => (this.isLoading = laoding)
    );
  }

  ngOnDestroy() {
    this._loadingSub?.unsubscribe();
    this._authorDetailsSub?.unsubscribe();
  }
}
