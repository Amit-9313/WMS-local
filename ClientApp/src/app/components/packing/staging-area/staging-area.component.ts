import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staging-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staging-area.component.html',
  styleUrls: ['./staging-area.component.css']
})
export class StagingAreaComponent {

  @Input() stagingItems: any[] = [];

}
