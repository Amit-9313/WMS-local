import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-packing-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './packing-session.component.html',
  styleUrls: ['./packing-session.component.css']
})
export class PackingSessionComponent {

  scannedCode = '';

  scannedItems: string[] = [];

  scan() {

    if (!this.scannedCode) return;

    this.scannedItems.push(this.scannedCode);

    this.scannedCode = '';

  }

}
