import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';

@Component({
  selector: 'app-root-layout-admin',
  standalone: true,
  imports: [RouterOutlet, AdminNavComponent],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.css',
})
export class RootLayoutComponent {}
