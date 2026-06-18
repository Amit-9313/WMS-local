import { Injectable } from '@angular/core';
// Uncomment when backend is connected
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

export interface Shelf {
  id: number;
  shelfName: string;
}

export interface Rack {
  id: number;
  rackName: string;
  shelves: Shelf[];
}

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
  racks: Rack[];
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  // ============================
  // BACKEND API URL
  // Uncomment when backend is ready
  // ============================

  // private apiUrl =
  //   'https://localhost:5001/api/warehouse';

  // constructor(
  //   private http: HttpClient
  // ) { }

  constructor() { }

  // ============================
  // DUMMY DATA FOR DEVELOPMENT
  // ============================

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
      status: 'Active',

      racks: [
        {
          id: 1,
          rackName: 'Rack-A',

          shelves: [
            {
              id: 1,
              shelfName: 'Shelf-1'
            },
            {
              id: 2,
              shelfName: 'Shelf-2'
            }
          ]
        }
      ]
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
      status: 'Active',

      racks: []
    }

  ];

  // ============================
  // GET ALL WAREHOUSES
  // ============================

  getWarehouses(): Warehouse[] {

    return [...this.warehouses];

    // Backend Version

    // return this.http.get<Warehouse[]>(
    //   this.apiUrl
    // );
  }

  // ============================
  // GET WAREHOUSE BY ID
  // ============================

  getWarehouseById(
    id: number
  ): Warehouse | undefined {

    return this.warehouses.find(
      x => x.id === id
    );

    // Backend Version

    // return this.http.get<Warehouse>(
    //   `${this.apiUrl}/${id}`
    // );
  }

  // ============================
  // CREATE WAREHOUSE
  // ============================

  addWarehouse(
    warehouse: Warehouse
  ): void {

    this.warehouses.unshift(
      warehouse
    );

    // Backend Version

    // return this.http.post(
    //   this.apiUrl,
    //   warehouse
    // );
  }

  // ============================
  // UPDATE WAREHOUSE
  // ============================

  updateWarehouse(
    updatedWarehouse: Warehouse
  ): void {

    const index =
      this.warehouses.findIndex(
        x => x.id === updatedWarehouse.id
      );

    if (index !== -1) {

      this.warehouses[index] = {
        ...updatedWarehouse
      };
    }

    // Backend Version

    // return this.http.put(
    //   `${this.apiUrl}/${updatedWarehouse.id}`,
    //   updatedWarehouse
    // );
  }

  // ============================
  // DELETE WAREHOUSE
  // ============================

  deleteWarehouse(
    id: number
  ): void {

    this.warehouses =
      this.warehouses.filter(
        x => x.id !== id
      );

    // Backend Version

    // return this.http.delete(
    //   `${this.apiUrl}/${id}`
    // );
  }

  // ============================
  // DASHBOARD COUNTS
  // ============================

  getTotalWarehouses(): number {

    return this.warehouses.length;
  }

  getActiveWarehouses(): number {

    return this.warehouses.filter(
      x => x.status === 'Active'
    ).length;
  }

  getInactiveWarehouses(): number {

    return this.warehouses.filter(
      x => x.status === 'Inactive'
    ).length;
  }

  getTotalArea(): number {

    return this.warehouses.reduce(
      (sum, x) => sum + x.totalAreaSqFt,
      0
    );
  }

}
