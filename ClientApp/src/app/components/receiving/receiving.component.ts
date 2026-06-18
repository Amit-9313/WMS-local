import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receiving',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receiving.component.html',
  styleUrls: ['./receiving.component.css']
})
export class ReceivingComponent {

  constructor(private router: Router) { }

  createGRN() {
    this.router.navigate(['/receiving/create']);
  }

  viewGRN(grnNo: string) {
    this.router.navigate(['/receiving/details', grnNo]);
  }

  grns = [
    {
      grnNumber: 'GRN-2026-001',
      poNumber: 'PO-2026-001',
      vendor: 'ABC Vendor',
      receiptType: 'PO',
      invoiceNumber: 'INV-1001',
      invoiceDate: '11-Jun-2026',
      vehicleNumber: 'GJ05AB1234',
      receivedBy: 'Admin',
      dockZone: 'Dock-01',
      status: 'Received'
    },
    {
      grnNumber: 'GRN-2026-002',
      poNumber: 'PO-2026-002',
      vendor: 'XYZ Vendor',
      receiptType: 'Direct Receipt',
      invoiceNumber: 'INV-1002',
      invoiceDate: '12-Jun-2026',
      vehicleNumber: 'MH12XY1234',
      receivedBy: 'Warehouse User',
      dockZone: 'Dock-02',
      status: 'Pending'
    }
  ];

  totalGRNs = 124;
  pendingGRNs = 18;
  inspectionPending = 9;
  closedGRNs = 97;
}
