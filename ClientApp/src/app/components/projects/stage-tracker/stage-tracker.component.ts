import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stage-tracker.component.html',
  styleUrls: ['./stage-tracker.component.css']
})
export class StageTrackerComponent {

  @Input() stages: any[] = [];

}
