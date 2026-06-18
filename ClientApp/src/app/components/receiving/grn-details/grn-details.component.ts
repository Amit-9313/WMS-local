import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grn-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grn-details.component.html',
  styleUrls: ['./grn-details.component.css']
})
export class GrnDetailsComponent {
  constructor(private router: Router) { }

  openBarcode() {
    this.router.navigate(['/receiving/barcode']);
  }

  openInspection() {
    this.router.navigate(['/receiving/inspection']);
  }

  grn = {
    grnNumber: 'GRN-2026-001',
    poNumber: 'PO-2026-001',
    vendor: 'ABC Vendor',
    invoiceNumber: 'INV-1001',
    invoiceDate: '11-Jun-2026',
    vehicleNumber: 'GJ05AB1234',
    dockZone: 'Dock-01',
    receivedBy: 'Admin',
    status: 'Received'
  };

  items = [
    {
      itemCode: 'ITM-001',
      itemName: 'Laptop',
      receivedQty: 50,
      acceptedQty: 48,
      rejectedQty: 2,
      batchNo: 'BAT001'
    },
    {
      itemCode: 'ITM-002',
      itemName: 'Monitor',
      receivedQty: 30,
      acceptedQty: 30,
      rejectedQty: 0,
      batchNo: 'BAT002'
    }
  ];

}
