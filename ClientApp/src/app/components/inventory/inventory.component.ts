import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Stock, Movement, CycleCount, Transfer } from '../../models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  activeTab = 'summary';

  filterText = '';

  stock: Stock[] = [];
  filteredStock: Stock[] = [];

  movements: Movement[] = [];
  cycles: CycleCount[] = [];
  transfers: Transfer[] = [];

  warehouses: any[] = [];
  items: any[] = [];

  totalOnHand = 0;
  totalReserved = 0;
  totalAvailable = 0;
  totalDamaged = 0;
  totalBlocked = 0;
  totalInTransit = 0;

  showAdjustForm = false;

  adjustForm: any = {
    itemId: '',
    qty: 0,
    reason: 'Cycle Count Variance'
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadStock();
    this.loadMovements();
    this.loadCycles();
    this.loadTransfers();

    this.api.get<any[]>('/warehouse')
      .subscribe(data => {
        this.warehouses = data || [];
      });

    this.api.get<any[]>('/item')
      .subscribe(data => {
        this.items = data || [];
      });
  }

  loadStock(): void {

    this.api.get<Stock[]>('/inventory')
      .subscribe(data => {

        this.stock = data || [];

        this.filterStock();

        this.totalOnHand =
          this.stock.reduce(
            (sum, item) => sum + (item.onHandQty || 0),
            0
          );

        this.totalReserved =
          this.stock.reduce(
            (sum, item) => sum + (item.reservedQty || 0),
            0
          );

        this.totalAvailable =
          this.stock.reduce(
            (sum, item) => sum + (item.availableQty || 0),
            0
          );

        this.totalDamaged =
          this.stock.reduce(
            (sum, item: any) => sum + (item.damagedQty || 0),
            0
          );

        this.totalBlocked =
          this.stock.reduce(
            (sum, item: any) => sum + (item.blockedQty || 0),
            0
          );

        this.totalInTransit =
          this.stock.reduce(
            (sum, item: any) => sum + (item.inTransitQty || 0),
            0
          );
      });
  }

  filterStock(): void {

    const search = this.filterText.toLowerCase();

    this.filteredStock = this.stock.filter((s: any) =>
      !search ||
      s.item?.skuCode?.toLowerCase()?.includes(search) ||
      s.item?.itemName?.toLowerCase()?.includes(search) ||
      s.lotNumber?.toLowerCase()?.includes(search)
    );
  }

  loadMovements(): void {

    this.api.get<Movement[]>('/inventory/movements')
      .subscribe(data => {
        this.movements = data || [];
      });
  }

  loadCycles(): void {

    this.api.get<CycleCount[]>('/inventory/cyclecounts')
      .subscribe(data => {
        this.cycles = data || [];
      });
  }

  loadTransfers(): void {

    this.api.get<Transfer[]>('/inventory/transfers')
      .subscribe(data => {
        this.transfers = data || [];
      });
  }

  openAdjust(stock: Stock): void {

    this.adjustForm.itemId = stock.stockId;
    this.adjustForm.qty = stock.onHandQty;

    this.showAdjustForm = true;
  }

  doAdjust(): void {

    this.api.put<any>(
      '/inventory/' + this.adjustForm.itemId + '/adjust',
      {
        qty: this.adjustForm.qty,
        reason: this.adjustForm.reason
      }
    )
      .subscribe(() => {

        this.loadStock();

        this.showAdjustForm = false;

        this.adjustForm = {
          itemId: '',
          qty: 0,
          reason: 'Cycle Count Variance'
        };
      });
  }

  getStageCode(stock: any): string {
    return stock?.stageCode || '-';
  }

  getBlockedQty(stock: any): number {
    return stock?.blockedQty || 0;
  }

  getInTransitQty(stock: any): number {
    return stock?.inTransitQty || 0;
  }

  getDamagedQty(stock: any): number {
    return stock?.damagedQty || 0;
  }

  getLotNumber(stock: any): string {
    return stock?.lotNumber || '-';
  }

  getMovementLotNumber(movement: any): string {
    return movement?.lotNumber || '-';
  }

  getPerformedBy(movement: any): string {
    return movement?.performedBy?.fullName || '-';
  }

  getStockStatus(stock: any): string {

    const available = stock?.availableQty || 0;

    if (available <= 0) {
      return 'Stock Out';
    }

    if (available <= 20) {
      return 'Low Stock';
    }

    return 'Adequate';
  }
}
