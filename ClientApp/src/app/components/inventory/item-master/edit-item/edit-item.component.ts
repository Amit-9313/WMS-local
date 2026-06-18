import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';

import {
  ItemService,
  InventoryItem
} from '../../../../services/item.service';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  item!: InventoryItem;

  qrImage = '';

  showQrModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) { }

  async ngOnInit(): Promise<void> {

    const itemId =
      this.route.snapshot.paramMap.get('id');

    if (!itemId) {

      this.router.navigate([
        '/inventory/item-master'
      ]);

      return;
    }

    const item =
      this.itemService.getItem(itemId);

    if (!item) {

      this.router.navigate([
        '/inventory/item-master'
      ]);

      return;
    }

    this.item = {
      ...item
    };

    await this.generateQrCode();
  }

  async generateQrCode(): Promise<void> {

    if (!this.item.serialNumber) {

      this.qrImage = '';

      return;
    }

    this.qrImage =
      await QRCode.toDataURL(
        this.item.serialNumber
      );
  }

  openQrModal(): void {

    this.showQrModal = true;

  }

  closeQrModal(): void {

    this.showQrModal = false;

  }

  save(): void {

    this.item.barcode =
      this.item.serialNumber;

    this.item.qrCode =
      this.item.serialNumber;

    this.itemService.updateItem(
      this.item
    );

    alert(
      'Item Updated Successfully'
    );

    this.router.navigate([
      '/item-master'
    ]);
  }

  back(): void {

    this.router.navigate([
      '/item-master'
    ]);

  }

}
