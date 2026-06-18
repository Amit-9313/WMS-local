import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css']
})
export class InventoryManagementComponent {

  stats = {
    warehouses: 4,
    models: 28,
    items: 1245,
    assigned: 856,
    defective: 14,
    available: 375
  };

  recentActivities = [
    {
      type: 'Item Added',
      message: 'Samsung LED 75" - SL125 added',
      time: '10 mins ago'
    },
    {
      type: 'Assignment',
      message: 'SL089 assigned to Project Lift-A',
      time: '35 mins ago'
    },
    {
      type: 'Warehouse',
      message: 'Warehouse-A updated',
      time: '1 hour ago'
    }
  ];

}