import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';
 
import {
  ItemService,
  InventoryItem
} from '../../../../services/item.service';
 
import {
  WarehouseService,
  Warehouse
} from '../../../../services/warehouse.service';
 
import {
  ModelService,
  Model
} from '../../../../services/model-master.service';
 
@Component({
  selector: 'app-create-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
 
  constructor(
    private router: Router,
    private warehouseService: WarehouseService,
    private modelService: ModelService,
    private itemService: ItemService
  ) { }
 
  models: Model[] = [];
  warehouses: Warehouse[] = [];
 
  availableRacks: any[] = [];
  availableShelves: any[] = [];
 
  qrImage = '';
 
  showQrModal = false;
 
  bins = [
    'Bin-1',
    'Bin-2',
    'Bin-3',
    'Bin-4'
  ];
 
  item: any = {
    modelId: '',
    modelNumber: '',
    serialNumber: '',
    status: 'Good',
    warehouse: '',
    rack: '',
    shelf: '',
    bin: '',
    project: '',
    assignmentId: ''
  };
 
  ngOnInit(): void {
 
    this.models =
      this.modelService.getModels();
 
    this.warehouses =
      this.warehouseService.getWarehouses();
 
  }
 
  onModelChange(): void {
 
    const selected =
      this.models.find(
        x => x.id == this.item.modelId
      );
 
    if (selected) {
 
      this.item.modelNumber =
        selected.modelNumber;
 
    }
 
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
 
  onWarehouseChange(): void {
 
    const warehouse =
      this.warehouses.find(
        x => x.warehouseName === this.item.warehouse
      );
 
    this.availableRacks =
      warehouse?.racks || [];
 
    this.availableShelves = [];
 
    this.item.rack = '';
    this.item.shelf = '';
 
  }
 
  onRackChange(): void {
 
    const rack =
      this.availableRacks.find(
        x => x.rackName === this.item.rack
      );
 
    this.availableShelves =
      rack?.shelves || [];
 
    this.item.shelf = '';
 
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
 
  save(): void {
 
    const selectedModel =
      this.models.find(
        x => x.id == this.item.modelId
      );
 
    if (!selectedModel) {
 
      alert('Please Select Model');
      return;
 
    }
 
    if (!this.item.serialNumber) {
 
      alert('Serial Number Required');
      return;
 
    }
 
    const duplicate =
      this.itemService.getItems().some(
        x =>
          x.serialNumber
            .trim()
            .toLowerCase()
          ===
          this.item.serialNumber
            .trim()
            .toLowerCase()
      );
 
    if (duplicate) {
 
      alert(
        'Serial Number Already Exists'
      );
 
      return;
 
    }
 
    const newItem: InventoryItem = {
 
      itemId: '',
 
      modelId:
        String(this.item.modelId),
 
      modelName:
        selectedModel.modelName,
 
      modelNumber:
        selectedModel.modelNumber,
 
      serialNumber:
        this.item.serialNumber,
 
      barcode:
        this.item.serialNumber,
 
      qrCode:
        this.item.serialNumber,
 
      warehouse:
        this.item.warehouse,
 
      rack:
        this.item.rack,
 
      shelf:
        this.item.shelf,
 
      bin:
        this.item.bin,
 
      project:
        this.item.project,
 
      assignmentId:
        this.item.assignmentId,
 
      status:
        this.item.status
 
    };
 
    this.itemService.addItem(
      newItem
    );
 
    this.modelService.increaseQuantity(
      selectedModel.id
    );
 
    alert(
      'Item Created Successfully'
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