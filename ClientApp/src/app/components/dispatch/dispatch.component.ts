import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { Shipment } from '../../models';

import { ShipmentFormComponent } from '../dispatch/shipment-form/shipment-form.component';
import { PackageAssignmentComponent } from '../dispatch/package-assignment/package-assignment.component';
import { EWayBillComponent } from '../dispatch/e-way-bill/e-way-bill.component';
import { DispatchConfirmComponent } from '../dispatch/dispatch-confirm/dispatch-confirm.component';
import { PODUploadComponent } from '../dispatch/pod-upload/pod-upload.component';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShipmentFormComponent,
    PackageAssignmentComponent,
    EWayBillComponent,
    DispatchConfirmComponent,
    PODUploadComponent
  ],
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.css']
})
export class DispatchComponent implements OnInit {
  activeTab = 'shipments';
  activeStatus = 'Draft';
  showCreateForm = false;
  shipments: Shipment[] = [];
  customers: any[] = [];
  warehouses: any[] = [];
  shipForm: any = { customerId: '', warehouseId: '', transportMode: 'Road', ewayBillNumber: '', deliveryAddress: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadShipments();
    this.api.get<any[]>('/item/customers').subscribe(d => this.customers = d || []);
    this.api.get<any[]>('/warehouse').subscribe(d => this.warehouses = d || []);
  }

  loadShipments(): void { this.api.get<Shipment[]>('/shipment').subscribe(d => this.shipments = d || []); }

  createShipment(): void {
    this.api.post<any>('/shipment', this.shipForm).subscribe(() => { this.loadShipments(); this.showCreateForm = false; });
  }

  dispatchShipment(s: Shipment): void {
    this.api.put<any>('/shipment/' + s.shipmentId + '/dispatch').subscribe(() => this.loadShipments());
  }

  shipmentPackages: any[] = [
    {
      packageNumber: 'PKG001',
      weight: 15,
      status: 'Sealed',
      selected: false
    },
    {
      packageNumber: 'PKG002',
      weight: 22,
      status: 'Sealed',
      selected: false
    },
    {
      packageNumber: 'PKG003',
      weight: 18,
      status: 'Sealed',
      selected: false
    }
  ];

  statusTabs = [
    'Draft',
    'Ready',
    'Dispatched',
    'In Transit',
    'Delivered'
  ];

  get draftCount() {
    return this.shipments.filter(x => x.status === 'Draft').length;
  }

  get dispatchedCount() {
    return this.shipments.filter(x => x.status === 'Dispatched').length;
  }

  get inTransitCount() {
    return this.shipments.filter(x => x.status === 'In Transit').length;
  }

  get deliveredCount() {
    return this.shipments.filter(x => x.status === 'Delivered').length;
  }

  saveShipment(data: any) {
    console.log(data);
  }

  confirmDispatch(data: any) {
    console.log(data);
  }
}
