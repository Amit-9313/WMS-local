import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CRN, VRN, Customer, Vendor } from '../../models';

@Component({
  selector: 'app-returns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {
  activeTab = 'customer';
  showCrnForm = false;
  showVrnForm = false;
  crns: CRN[] = [];
  vrns: VRN[] = [];
  customers: Customer[] = [];
  vendors: Vendor[] = [];
  crnForm: any = { customerId: '', returnReason: '' };
  vrnForm: any = { vendorId: '', returnReason: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCRNs();
    this.loadVRNs();
    this.api.get<Customer[]>('/item/customers').subscribe(d => this.customers = d || []);
    this.api.get<Vendor[]>('/item/vendors').subscribe(d => this.vendors = d || []);
  }

  loadCRNs(): void {
    this.api.get<CRN[]>('/returns/customer').subscribe(d => this.crns = d || []);
  }

  loadVRNs(): void {
    this.api.get<VRN[]>('/returns/vendor').subscribe(d => this.vrns = d || []);
  }

  createCRN(): void {
    this.api.post<any>('/returns/customer', this.crnForm).subscribe(() => { this.loadCRNs(); this.showCrnForm = false; });
  }

  createVRN(): void {
    this.api.post<any>('/returns/vendor', this.vrnForm).subscribe(() => { this.loadVRNs(); this.showVrnForm = false; });
  }
}
