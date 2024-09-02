import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
})
export class PopoverComponent {
  @Input() linkIcon = 'info-circle';
  @Input() iconColor = 'rgb(75 246 240)';
  @Input() linkText: string = '';
}
