import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as QRCode from 'qrcode';
 
import {
  ItemService,
  InventoryItem
} from '../../../../services/item.service';
 
@Component({
  selector: 'app-view-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.css']
})
export class ViewItemComponent implements OnInit {
 
  item!: InventoryItem;
 
  qrImage = '';
 
  showQrModal = false;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) { }
 
  ngOnInit(): void {
 
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
 
    QRCode.toDataURL(
      this.item.serialNumber
    ).then(result => {
 
      this.qrImage = result;
 
    });
 
  }
 
  openQrModal(): void {
 
    if (!this.qrImage) {
      return;
    }
 
    this.showQrModal = true;
 
  }
 
  closeQrModal(): void {
 
    this.showQrModal = false;
 
  }
 
  back(): void {
 
    this.router.navigate([
      '/inventory/item-master'
    ]);
 
  }
 
}