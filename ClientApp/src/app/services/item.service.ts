import { Injectable } from '@angular/core';
import {
  ModelService
} from './model-master.service';

// Uncomment when backend is connected
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

export interface InventoryItem {

  itemId: string;

  modelId: string;
  modelName: string;
  modelNumber: string;

  serialNumber: string;

  barcode: string;
  qrCode: string;

  warehouse: string;
  rack: string;
  shelf: string;
  bin: string;

  project: string;
  assignmentId: string;

  status:
  | 'Good'
  | 'Defective'
  | 'In Use'
  | 'Reserved'
  | 'Maintenance';
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  // Backend API
  // private apiUrl =
  // 'https://localhost:5000/api/items';

  private items: InventoryItem[] = [];

  constructor(
    private modelService: ModelService
    // private http: HttpClient
  ) { }

  getItems(): InventoryItem[] {

    return [...this.items];

    // Backend Version

    // return this.http.get<InventoryItem[]>(
    //   this.apiUrl
    // );
  }

  getItem(
    itemId: string
  ): InventoryItem | undefined {

    return this.items.find(
      x => x.itemId === itemId
    );

    // Backend Version

    // return this.http.get<InventoryItem>(
    //   `${this.apiUrl}/${itemId}`
    // );
  }

  addItem(
    item: InventoryItem
  ): void {

    const exists =
      this.items.some(
        x =>
          x.serialNumber
            .trim()
            .toLowerCase()
          ===
          item.serialNumber
            .trim()
            .toLowerCase()
      );

    if (exists) {

      alert(
        'Serial Number Already Exists'
      );

      return;
    }

    const newItem: InventoryItem = {

      ...item,

      itemId:
        crypto.randomUUID()
    };

    this.items.unshift(
      newItem
    );

    // Increase model quantity

    if (item.modelId) {

      this.modelService
        .increaseQuantity(
          Number(item.modelId)
        );
    }

    // Backend Version

    // return this.http.post(
    //   this.apiUrl,
    //   item
    // );
  }

  updateItem(
    item: InventoryItem
  ): void {

    const index =
      this.items.findIndex(
        x => x.itemId === item.itemId
      );

    if (index !== -1) {

      this.items[index] = {
        ...item
      };
    }

    // Backend Version

    // return this.http.put(
    //   `${this.apiUrl}/${item.itemId}`,
    //   item
    // );
  }

  deleteItem(
    itemId: string
  ): void {

    const item =
      this.items.find(
        x => x.itemId === itemId
      );

    if (item) {

      if (item.modelId) {

        this.modelService
          .decreaseQuantity(
            Number(item.modelId)
          );
      }
    }

    this.items =
      this.items.filter(
        x => x.itemId !== itemId
      );

    // Backend Version

    // return this.http.delete(
    //   `${this.apiUrl}/${itemId}`
    // );
  }

  bulkUploadItems(
    uploadedItems: InventoryItem[]
  ): void {

    uploadedItems.forEach(item => {

      const exists =
        this.items.some(
          x =>
            x.serialNumber
              .trim()
              .toLowerCase()
            ===
            item.serialNumber
              .trim()
              .toLowerCase()
        );

      if (!exists) {

        const newItem: InventoryItem = {

          ...item,

          itemId:
            crypto.randomUUID()
        };

        this.items.unshift(
          newItem
        );

        // Update Model Quantity

        if (item.modelId) {

          this.modelService
            .increaseQuantity(
              Number(item.modelId)
            );
        }
      }

    });

    // Backend Version

    // return this.http.post(
    //   `${this.apiUrl}/bulk-upload`,
    //   uploadedItems
    // );
  }

  clearAllItems(): void {

    this.items = [];
  }

}
