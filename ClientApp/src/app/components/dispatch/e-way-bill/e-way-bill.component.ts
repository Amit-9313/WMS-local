import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-e-way-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './e-way-bill.component.html',
  styleUrls: ['./e-way-bill.component.css']
})
export class EWayBillComponent {

  eWayBillNumber = '';
  expiryDate = '';

  get hoursRemaining() {

    if (!this.expiryDate) return 0;

    const diff =
      new Date(this.expiryDate).getTime()
      - new Date().getTime();

    return Math.floor(diff / 3600000);
  }
}
