import { Injectable } from '@angular/core';

export interface Warehouse {
  id: number;
  warehouseCode: string;
  warehouseName: string;
  branch: string;
  address: string;
  latitude: string;
  longitude: string;
  timezone: string;
  totalAreaSqFt: number;
  defaultDockZone: string;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private warehouses: Warehouse[] = [
    {
      id: 1,
      warehouseCode: 'WH-001',
      warehouseName: 'Main Warehouse',
      branch: 'Surat',
      address: 'Surat',
      latitude: '',
      longitude: '',
      timezone: 'Asia/Kolkata',
      totalAreaSqFt: 25000,
      defaultDockZone: 'Z-DOCK-01',
      status: 'Active'
    },
    {
      id: 2,
      warehouseCode: 'WH-002',
      warehouseName: 'Project Warehouse',
      branch: 'Ahmedabad',
      address: 'Ahmedabad',
      latitude: '',
      longitude: '',
      timezone: 'Asia/Kolkata',
      totalAreaSqFt: 18000,
      defaultDockZone: 'Z-DOCK-02',
      status: 'Active'
    }
  ];

  getWarehouses(): Warehouse[] {
    return this.warehouses;
  }

  getWarehouseById(id: number): Warehouse | undefined {
    return this.warehouses.find(w => w.id === id);
  }

  addWarehouse(warehouse: Warehouse): void {
    this.warehouses.push(warehouse);
  }

  updateWarehouse(updatedWarehouse: Warehouse): void {
    const index = this.warehouses.findIndex(
      w => w.id === updatedWarehouse.id
    );

    if (index !== -1) {
      this.warehouses[index] = { ...updatedWarehouse };
    }
  }
}
