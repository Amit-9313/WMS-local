import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bom-line-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bom-line-table.component.html',
  styleUrls: ['./bom-line-table.component.css']
})
export class BomLineTableComponent {

  @Input() lines: any[] = [];

}
