import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barcode-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent {

  barcodeInput = '';

  scannedItems = [
    {
      barcode: 'BC100001',
      itemCode: 'ITM-001',
      itemName: 'Laptop',
      qty: 10,
      status: 'Verified'
    },
    {
      barcode: 'BC100002',
      itemCode: 'ITM-002',
      itemName: 'Monitor',
      qty: 5,
      status: 'Pending'
    }
  ];

  scanBarcode() {

    if (!this.barcodeInput.trim()) return;

    this.scannedItems.unshift({
      barcode: this.barcodeInput,
      itemCode: 'NEW',
      itemName: 'Scanned Item',
      qty: 1,
      status: 'Pending'
    });

    this.barcodeInput = '';
  }

  verifyBarcode(item: any) {
    item.status = 'Verified';
  }

  removeBarcode(index: number) {
    this.scannedItems.splice(index, 1);
  }
}
