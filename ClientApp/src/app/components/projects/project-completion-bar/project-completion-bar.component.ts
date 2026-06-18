import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-completion-bar',
  standalone: true,
  templateUrl: './project-completion-bar.component.html',
  styleUrls: ['./project-completion-bar.component.css']
})
export class ProjectCompletionBarComponent {

  @Input() completion = 0;

}
