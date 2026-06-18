import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-grn',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.css']
})
export class CreateGrnComponent {

  grn = {
    grnNumber: 'GRN-2026-001',
    receiptType: 'PO',
    poNumber: '',
    vendor: '',
    invoiceNumber: '',
    invoiceDate: '',
    vehicleNumber: '',
    dockZone: '',
    receivedBy: '',
    remarks: ''
  };

  items = [
    {
      itemCode: '',
      itemName: '',
      expectedQty: 0,
      receivedQty: 0,
      uom: ''
    }
  ];

  addItem() {
    this.items.push({
      itemCode: '',
      itemName: '',
      expectedQty: 0,
      receivedQty: 0,
      uom: ''
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  saveDraft() {
    console.log('Draft Saved', this.grn);
  }

  submitGRN() {
    console.log('GRN Submitted', this.grn);
  }
}
