import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import {
  WarehouseService,
  Rack,
  Shelf
} from '../../../../services/warehouse.service';

@Component({
  selector: 'app-create-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.css']
})
export class CreateWarehouseComponent implements AfterViewInit {

  private map!: L.Map;
  private marker!: L.Marker;

  racks: Rack[] = [];

  rackName = '';
  shelfCount = 1;

  warehouseForm = {
    warehouseCode: '',
    warehouseName: '',
    branch: '',
    address: '',
    latitude: '',
    longitude: '',
    timezone: 'Asia/Kolkata',
    totalAreaSqFt: 0,
    defaultDockZone: '',
    status: 'Active'
  };

  constructor(
    private router: Router,
    private warehouseService: WarehouseService
  ) { }

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.initializeMap();
    }, 200);
  }

  initializeMap(): void {

    this.map = L.map('warehouseMap')
      .setView([21.1702, 72.8311], 13);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19
      }
    ).addTo(this.map);

    this.map.on('click', (e: any) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      this.marker =
        L.marker([lat, lng])
          .addTo(this.map);

      this.warehouseForm.latitude =
        lat.toFixed(6);

      this.warehouseForm.longitude =
        lng.toFixed(6);

      this.reverseGeocode(lat, lng);
    });
  }

  reverseGeocode(
    lat: number,
    lng: number
  ): void {

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
      .then(response => response.json())
      .then(data => {

        this.warehouseForm.address =
          data.display_name || '';
      })
      .catch(error => {

        console.error(
          'Reverse geocode error:',
          error
        );
      });
  }

  addRack(): void {

    if (!this.rackName.trim()) {

      alert('Enter Rack Name');
      return;
    }

    const shelves: Shelf[] = [];

    for (
      let i = 1;
      i <= this.shelfCount;
      i++
    ) {

      shelves.push({
        id: Date.now() + i,
        shelfName: `Shelf-${i}`
      });
    }

    this.racks.push({

      id: Date.now(),

      rackName:
        this.rackName,

      shelves:
        shelves
    });

    this.rackName = '';
    this.shelfCount = 1;
  }

  saveWarehouse(): void {

    if (
      !this.warehouseForm.warehouseCode ||
      !this.warehouseForm.warehouseName ||
      !this.warehouseForm.branch ||
      !this.warehouseForm.address
    ) {

      alert(
        'Please fill all required fields'
      );

      return;
    }

    this.warehouseService.addWarehouse({

      id: Date.now(),

      warehouseCode:
        this.warehouseForm.warehouseCode,

      warehouseName:
        this.warehouseForm.warehouseName,

      branch:
        this.warehouseForm.branch,

      address:
        this.warehouseForm.address,

      latitude:
        this.warehouseForm.latitude,

      longitude:
        this.warehouseForm.longitude,

      timezone:
        this.warehouseForm.timezone,

      totalAreaSqFt:
        Number(
          this.warehouseForm.totalAreaSqFt
        ),

      defaultDockZone:
        this.warehouseForm.defaultDockZone,

      status:
        this.warehouseForm.status as
        'Active' | 'Inactive',

      racks:
        this.racks
    });

    alert(
      'Warehouse Saved Successfully'
    );

    this.router.navigate([
      '/warehouse'
    ]);
  }

  cancel(): void {

    this.router.navigate([
      '/warehouse'
    ]);
  }
}
