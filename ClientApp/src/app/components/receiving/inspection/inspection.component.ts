import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inspection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent {

  inspections = [
    {
      inspectionNo: 'INS-001',
      grnNo: 'GRN-2026-001',
      itemCode: 'ITM-001',
      itemName: 'Laptop',
      receivedQty: 50,
      acceptedQty: 48,
      rejectedQty: 2,
      inspector: 'Admin',
      status: 'Pending'
    },
    {
      inspectionNo: 'INS-002',
      grnNo: 'GRN-2026-002',
      itemCode: 'ITM-002',
      itemName: 'Monitor',
      receivedQty: 30,
      acceptedQty: 30,
      rejectedQty: 0,
      inspector: 'John',
      status: 'Passed'
    }
  ];

  passInspection(item: any) {
    item.status = 'Passed';
  }

  failInspection(item: any) {
    item.status = 'Failed';
  }

  get pendingCount() {
    return this.inspections.filter(x => x.status === 'Pending').length;
  }

  get passedCount() {
    return this.inspections.filter(x => x.status === 'Passed').length;
  }

  get failedCount() {
    return this.inspections.filter(x => x.status === 'Failed').length;
  }
}
