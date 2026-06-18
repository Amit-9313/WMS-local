import { Injectable } from '@angular/core';

export interface InventoryItem {

  itemId: string;

  skuCode: string;
  itemName: string;
  description: string;

  categoryId: string;
  uomId: string;

  weightKg: number;
  hsnCode: string;

  serialRequired: boolean;
  batchRequired: boolean;
  expiryRequired: boolean;

  isHazardous: boolean;
  hazmatClass: string;

  isConsignment: boolean;
  consignmentVendorId: string;

  moq: number;
  packSize: number;

  minStockQty: number;
  maxStockQty: number;

  reorderLevel: number;
  reorderQty: number;

  standardCost: number;

  valuationMethod: string;

  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private items: InventoryItem[] = [

    {
      itemId: crypto.randomUUID(),

      skuCode: 'SKU-001',
      itemName: 'Samsung LED TV 75"',
      description: '75 inch LED Display',

      categoryId: 'CAT-001',
      uomId: 'PCS',

      weightKg: 32.5,
      hsnCode: '852872',

      serialRequired: true,
      batchRequired: false,
      expiryRequired: false,

      isHazardous: false,
      hazmatClass: '',

      isConsignment: false,
      consignmentVendorId: '',

      moq: 1,
      packSize: 1,

      minStockQty: 5,
      maxStockQty: 100,

      reorderLevel: 10,
      reorderQty: 20,

      standardCost: 85000,

      valuationMethod: 'FIFO',

      isActive: true
    }
  ];

  constructor() { }

  getItems(): InventoryItem[] {

    return this.items.map(item => ({
      ...item
    }));
  }

  getItem(itemId: string): InventoryItem | undefined {

    return this.items.find(
      item => item.itemId === itemId
    );
  }

  addItem(item: InventoryItem): void {

    const newItem: InventoryItem = {
      ...item,
      itemId: crypto.randomUUID()
    };

    this.items.unshift(newItem);
  }

  updateItem(updatedItem: InventoryItem): void {

    const index = this.items.findIndex(
      item => item.itemId === updatedItem.itemId
    );

    if (index !== -1) {

      this.items[index] = { ...updatedItem };
    }
  }

  deleteItem(itemId: string): void {

    this.items = this.items.filter(
      item => item.itemId !== itemId
    );
  }
}
