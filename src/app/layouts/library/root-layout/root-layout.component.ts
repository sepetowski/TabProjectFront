import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root-layout-library',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './root-layout.component.html',
  styleUrl: './root-layout.component.css',
})
export class RootLayoutComponent {}
