import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-status-badge.component.html',
  styleUrls: ['./project-status-badge.component.css']
})
export class ProjectStatusBadgeComponent {

  @Input() status = 'Planned';

  get statusClass(): string {
    return this.status.toLowerCase().replace(' ', '-');
  }

}
