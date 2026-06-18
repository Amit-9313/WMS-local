import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bom-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bom-import.component.html',
  styleUrls: ['./bom-import.component.css']
})
export class BomImportComponent {

  @Output() fileSelected =
    new EventEmitter<File>();

  onChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.fileSelected.emit(file);
    }
  }

}
