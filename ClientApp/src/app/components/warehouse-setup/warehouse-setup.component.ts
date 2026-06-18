import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Warehouse, Zone, Rack, Item, Vendor, Customer } from '../../models';

@Component({
  selector: 'app-warehouse-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-setup.component.html',
  styleUrls: ['./warehouse-setup.component.css']
})
export class WarehouseSetupComponent implements OnInit {
  activeTab = 'warehouses';
  warehouses: Warehouse[] = [];
  zones: Zone[] = [];
  racks: Rack[] = [];
  items: Item[] = [];
  vendors: Vendor[] = [];
  customers: Customer[] = [];
  showWhForm = false;
  showZoneForm = false;
  showRackForm = false;
  showItemForm = false;
  showVendorForm = false;
  showCustomerForm = false;
  whForm: any = { warehouseCode: '', warehouseName: '', address: '', timezone: 'Asia/Kolkata', totalAreaSqFt: 0 };
  zoneForm: any = { warehouseId: '', zoneCode: '', zoneName: '', zoneType: 'Storage', stageAssignment: '' };
  rackForm: any = { zoneId: '', rackCode: '', levelCount: 1, orientation: 'Horizontal', length: 0, width: 0, height: 0 };
  itemForm: any = { skuCode: '', itemName: '', description: '', hsnCode: '', standardCost: 0, minStockQty: 0, uomId: '' };
  vendorForm: any = { vendorCode: '', vendorName: '', contactPerson: '', email: '', mobile: '', gstNumber: '' };
  customerForm: any = { customerCode: '', customerName: '', contactPerson: '', mobile: '', gstNumber: '', projectName: '' };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadWarehouses();
    this.loadItems();
    this.loadVendors();
    this.loadCustomers();
  }

 loadWarehouses(): void {
  this.api.get<Warehouse[]>('/warehouse')
    .subscribe((d: Warehouse[] | null) => {
      this.warehouses = d ?? [];
    });
}

loadZones(): void {
  const whId = this.warehouses.length
    ? this.warehouses[0].warehouseId
    : '';

  if (whId) {
    this.api.get<Zone[]>('/warehouse/' + whId + '/zones')
      .subscribe((d: Zone[] | null) => {
        this.zones = d ?? [];
      });
  }
}

loadRacks(): void {
  const zId = this.zones.length
    ? this.zones[0].zoneId
    : '';

  if (zId) {
    this.api.get<Rack[]>('/warehouse/zones/' + zId + '/racks')
      .subscribe((d: Rack[] | null) => {
        this.racks = d ?? [];
      });
  }
}

loadItems(): void {
  this.api.get<Item[]>('/item')
    .subscribe((d: Item[] | null) => {
      this.items = d ?? [];
    });
}

loadVendors(): void {
  this.api.get<Vendor[]>('/item/vendors')
    .subscribe((d: Vendor[] | null) => {
      this.vendors = d ?? [];
    });
}

loadCustomers(): void {
  this.api.get<Customer[]>('/item/customers')
    .subscribe((d: Customer[] | null) => {
      this.customers = d ?? [];
    });
}

getWhName(id: string): string {
  const w = this.warehouses.find(x => x.warehouseId === id);
  return w ? w.warehouseName : id;
}

getZoneName(id: string): string {
  const z = this.zones.find(x => x.zoneId === id);
  return z ? z.zoneCode : id;
}
  saveWarehouse(): void {
    if (this.whForm.warehouseId) {
      this.api.put<any>('/warehouse/' + this.whForm.warehouseId, this.whForm).subscribe(() => { this.loadWarehouses(); this.showWhForm = false; });
    } else {
      this.api.post<any>('/warehouse', this.whForm).subscribe(() => { this.loadWarehouses(); this.showWhForm = false; });
    }
  }
  saveZone(): void {
    if (this.zoneForm.zoneId) {
      this.api.put<any>('/warehouse/zones/' + this.zoneForm.zoneId, this.zoneForm).subscribe(() => { this.loadZones(); this.showZoneForm = false; });
    } else {
      this.api.post<any>('/warehouse/' + this.zoneForm.warehouseId + '/zones', this.zoneForm).subscribe(() => { this.loadZones(); this.showZoneForm = false; });
    }
  }
  saveRack(): void {
    if (this.rackForm.rackId) {
      this.api.put<any>('/warehouse/zones/' + this.rackForm.rackId + '/racks', this.rackForm).subscribe(() => { this.loadRacks(); this.showRackForm = false; });
    } else {
      this.api.post<any>('/warehouse/zones/' + this.rackForm.zoneId + '/racks', this.rackForm).subscribe(() => { this.loadRacks(); this.showRackForm = false; });
    }
  }
  saveItem(): void {
    const obs = this.itemForm.itemId ? this.api.put<any>('/item/' + this.itemForm.itemId, this.itemForm) : this.api.post<any>('/item', this.itemForm);
    obs.subscribe(() => { this.loadItems(); this.showItemForm = false; });
  }
  saveVendor(): void { this.api.post<any>('/item/vendors', this.vendorForm).subscribe(() => { this.loadVendors(); this.showVendorForm = false; }); }
  saveCustomer(): void { this.api.post<any>('/item/customers', this.customerForm).subscribe(() => { this.loadCustomers(); this.showCustomerForm = false; }); }
  editWarehouse(w: Warehouse): void { this.whForm = { ...w }; this.showWhForm = true; }
  editZone(z: Zone): void { this.zoneForm = { ...z }; this.showZoneForm = true; }
  editRack(r: Rack): void { this.rackForm = { ...r }; this.showRackForm = true; }
  editItem(i: Item): void { this.itemForm = { ...i }; this.showItemForm = true; }
  deleteWarehouse(w: Warehouse): void { if (confirm('Delete?')) this.api.delete('/warehouse/' + w.warehouseId).subscribe(() => this.loadWarehouses()); }
  deleteZone(z: Zone): void { if (confirm('Delete?')) this.api.delete('/warehouse/zones/' + z.zoneId).subscribe(() => this.loadZones()); }
  deleteRack(r: Rack): void { if (confirm('Delete?')) this.api.delete('/warehouse/zones/' + r.rackId + '/racks').subscribe(() => this.loadRacks()); }
  deleteItem(i: Item): void { if (confirm('Delete?')) this.api.delete('/item/' + i.itemId).subscribe(() => this.loadItems()); }
}
