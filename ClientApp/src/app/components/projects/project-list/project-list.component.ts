import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectStatusBadgeComponent } from '../project-status-badge/project-status-badge.component';
import { ProjectCompletionBarComponent } from '../project-completion-bar/project-completion-bar.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    ProjectStatusBadgeComponent,
    ProjectCompletionBarComponent
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {

  @Input() projects: any[] = [];

  @Output()
  viewProject = new EventEmitter<any>();

}
