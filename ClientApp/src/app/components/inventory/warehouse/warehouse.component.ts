import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse.service';
interface Warehouse {
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

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent {

  constructor(
    private warehouseService: WarehouseService,
    private router: Router
  ) { }

  searchText = '';

  warehouses: Warehouse[] = [];

  ngOnInit(): void {

    this.warehouses =
      this.warehouseService.getWarehouses();

  }

  get filteredWarehouses(): Warehouse[] {

    return this.warehouses.filter(w =>

      w.warehouseCode
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      w.warehouseName
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      ||

      w.branch
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

    );

  }

  get totalWarehouses(): number {

    return this.warehouses.length;

  }

  get activeWarehouseCount(): number {

    return this.warehouses.filter(
      w => w.status === 'Active'
    ).length;

  }

  get inactiveWarehouseCount(): number {

    return this.warehouses.filter(
      w => w.status === 'Inactive'
    ).length;

  }

  get totalArea(): number {

    return this.warehouses.reduce(
      (sum, warehouse) =>
        sum + warehouse.totalAreaSqFt,
      0
    );

  }

  editWarehouse(id: number): void {

    this.router.navigate([
      '/inventory/edit-warehouse',
      id
    ]);

  }

  deleteWarehouse(id: number): void {

    const confirmed =
      confirm('Delete Warehouse?');

    if (!confirmed) {
      return;
    }

    this.warehouses =
      this.warehouses.filter(
        x => x.id !== id
      );

  }

  viewWarehouse(id: number): void {

    this.router.navigate([
      '/inventory/view-warehouse',
      id
    ]);

  }

}
