import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ItemUploadService
} from '../../../services/item-upload.service';

import {
  ItemService,
  InventoryItem
} from '../../../services/item.service';

@Component({
  selector: 'app-item-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

  items: InventoryItem[] = [];

  filteredItems: InventoryItem[] = [];

  searchText = '';

  constructor(
    private router: Router,
    private itemService: ItemService,
    private itemUploadService: ItemUploadService
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {

    this.items =
      this.itemService.getItems();

    this.filteredItems =
      [...this.items];
  }

  filterItems(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();

    if (!search) {

      this.filteredItems =
        [...this.items];

      return;
    }

    this.filteredItems =
      this.items.filter(item =>

        item.modelName
          .toLowerCase()
          .includes(search)

        ||

        item.modelNumber
          .toLowerCase()
          .includes(search)

        ||

        item.serialNumber
          .toLowerCase()
          .includes(search)

        ||

        item.warehouse
          .toLowerCase()
          .includes(search)

      );
  }

  openCreateItem(): void {

    this.router.navigate([
      '/inventory/item-master/create'
    ]);
  }

  viewItem(item: InventoryItem): void {

    this.router.navigate([
      '/inventory/item-master/view',
      item.itemId
    ]);
  }

  editItem(item: InventoryItem): void {

    this.router.navigate([
      '/inventory/item-master/edit',
      item.itemId
    ]);
  }



  async onFileSelected(
    event: any
  ): Promise<void> {

    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    try {

      const items =
        await this.itemUploadService
          .parseExcel(file);

      this.itemService
        .bulkUploadItems(items);

      this.loadItems();

      alert(
        `${items.length}
      items uploaded successfully`
      );

    }
    catch {

      alert(
        'Invalid Excel File'
      );

    }

  }



  deleteItem(itemId: string): void {

    if (!confirm('Delete Item ?')) {
      return;
    }

    this.itemService.deleteItem(
      itemId
    );

    this.loadItems();
  }
}
