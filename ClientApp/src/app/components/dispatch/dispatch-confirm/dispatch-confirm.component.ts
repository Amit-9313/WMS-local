import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dispatch-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dispatch-confirm.component.html',
  styleUrls: ['./dispatch-confirm.component.css']
})
export class DispatchConfirmComponent {

  @Output()
  confirm = new EventEmitter();

  vehicleNumber = '';
  driverName = '';
  driverMobile = '';
  lrNumber = '';

  dispatch() {
    this.confirm.emit({
      vehicleNumber: this.vehicleNumber,
      driverName: this.driverName,
      driverMobile: this.driverMobile,
      lrNumber: this.lrNumber
    });
  }
}
