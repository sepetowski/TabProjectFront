import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-error-message',
  standalone: true,
  imports: [],
  templateUrl: './input-error-message.component.html',
  styleUrl: './input-error-message.component.css',
})
export class InputErrorMessageComponent {
  @Input() message: string | null = null;
}
