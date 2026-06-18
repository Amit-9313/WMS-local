import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipment-form.component.html',
  styleUrls: ['./shipment-form.component.css']
})
export class ShipmentFormComponent {

  @Input() customers: any[] = [];
  @Input() projects: any[] = [];

  @Output() save = new EventEmitter<any>();

  shipment = {
    customerId: '',
    projectId: '',
    deliveryAddress: '',
    plannedDate: '',
    transportMode: 'Road',
    courierName: ''
  };

  submit() {
    this.save.emit(this.shipment);
  }
}
