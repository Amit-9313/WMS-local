import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { PR, PO, Vendor } from '../../models';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.css']
})
export class ProcurementComponent implements OnInit {
  activeTab = 'pr';
  showGrnForm = false;
  showPoForm = false;
  prs: PR[] = [];
  pos: PO[] = [];
  vendors: Vendor[] = [];
  warehouses: any[] = [];
  items: any[] = [];
  poForm: any = { vendorId: '', warehouseId: '', selectedItemId: '', lineQty: 1, linePrice: 0 };

  constructor(private api: ApiService) {}
  grns = [
    {
      grnNumber: 'GRN-2026-00789',
      poNumber: 'PO-2026-00458',
      vendor: 'Delta Cables',
      receiptType: 'PO',
      invoiceNumber: 'INV-4589',
      invoiceDate: '2026-06-12',
      vehicleNumber: 'GJ05AB1234',
      receivedBy: 'A. Shah',
      qcStatus: 'Hold',
      status: 'QC Pending'
    },
    {
      grnNumber: 'GRN-2026-00788',
      poNumber: 'PO-2026-00452',
      vendor: 'Premium Tools',
      receiptType: 'PO',
      invoiceNumber: 'INV-4588',
      invoiceDate: '2026-06-11',
      vehicleNumber: 'GJ05AB5678',
      receivedBy: 'R. Patel',
      qcStatus: 'Pass',
      status: 'Closed'
    }
  ];

  ngOnInit(): void {
    this.loadPRs();
    this.loadPOs();
    this.api.get<any[]>('/warehouse').subscribe(d => this.warehouses = d || []);
    this.api.get<any[]>('/item').subscribe(d => this.items = d || []);
    this.api.get<Vendor[]>('/item/vendors').subscribe(d => this.vendors = d || []);
  }

  loadPRs(): void {
    this.api.get<PR[]>('/purchase/pr').subscribe(d => this.prs = d || []);
  }

  loadPOs(): void {
    this.api.get<PO[]>('/purchase/po').subscribe(d => this.pos = d || []);
  }

  onVendorChange(): void {}

  createPO(): void {
    const body = {
      vendorId: this.poForm.vendorId,
      warehouseId: this.poForm.warehouseId,
      lines: [{ itemId: this.poForm.selectedItemId, orderedQty: this.poForm.lineQty, unitPrice: this.poForm.linePrice }]
    };
    this.api.post<any>('/purchase/po', body).subscribe(() => { this.loadPOs(); this.showPoForm = false; });
  }
}
