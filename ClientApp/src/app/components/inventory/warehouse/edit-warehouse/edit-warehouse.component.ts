import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';

import {
  WarehouseService,
  Warehouse,
  Rack
} from '../../../../services/warehouse.service';

@Component({
  selector: 'app-edit-warehouse',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './edit-warehouse.component.html',
  styleUrls: ['./edit-warehouse.component.css']
})
export class EditWarehouseComponent
  implements OnInit, AfterViewInit {

  warehouseId!: number;

  private map!: L.Map;
  private marker!: L.Marker;

  warehouseForm: Warehouse = {

    id: 0,

    warehouseCode: '',
    warehouseName: '',
    branch: '',

    address: '',

    latitude: '',
    longitude: '',

    timezone: 'Asia/Kolkata',

    totalAreaSqFt: 0,

    defaultDockZone: '',

    status: 'Active',

    racks: []
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {

    this.warehouseId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    const warehouse =
      this.warehouseService
        .getWarehouses()
        .find(
          x => x.id === this.warehouseId
        );

    if (warehouse) {

      this.warehouseForm = {

        ...warehouse,

        racks: warehouse.racks || []
      };
    }
  }

  ngAfterViewInit(): void {

    setTimeout(() => {

      this.initializeMap();

    }, 500);
  }

  initializeMap(): void {

    if (this.map) {
      this.map.remove();
    }

    const lat =
      Number(this.warehouseForm.latitude)
      || 21.1702;

    const lng =
      Number(this.warehouseForm.longitude)
      || 72.8311;

    this.map = L.map('warehouseMap')
      .setView([lat, lng], 13);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19
      }
    ).addTo(this.map);

    this.marker =
      L.marker([lat, lng])
        .addTo(this.map);

    this.map.on(
      'click',
      (e: any) => {

        const latitude =
          e.latlng.lat;

        const longitude =
          e.latlng.lng;

        this.marker.setLatLng([
          latitude,
          longitude
        ]);

        this.warehouseForm.latitude =
          latitude.toFixed(6);

        this.warehouseForm.longitude =
          longitude.toFixed(6);

        this.reverseGeocode(
          latitude,
          longitude
        );
      }
    );
  }

  reverseGeocode(
    lat: number,
    lng: number
  ): void {

    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
      .then(
        response => response.json()
      )
      .then(
        data => {

          this.warehouseForm.address =
            data.display_name || '';
        }
      );
  }

  updateWarehouse(): void {

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

    this.warehouseService
      .updateWarehouse(
        this.warehouseForm
      );

    alert(
      'Warehouse Updated Successfully'
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
