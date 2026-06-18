import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-putaway',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './putaway.component.html',
  styleUrls: ['./putaway.component.css']
})
export class PutawayComponent {

  kpis = {
    pending: 12,
    inProgress: 5,
    completed: 48,
    avgTime: '18 min'
  };

  tasks = [
    {
      taskNo: 'PT-2026-001',
      sku: 'MTR-1001',
      item: 'Motor Assembly',
      qty: 50,
      source: 'DOCK-A',
      destination: 'A-R01-S02-B04',
      assignedTo: 'Operator-01',
      priority: 'High',
      status: 'Pending'
    },
    {
      taskNo: 'PT-2026-002',
      sku: 'CBL-2001',
      item: 'Control Cable',
      qty: 120,
      source: 'DOCK-B',
      destination: 'B-R03-S01-B02',
      assignedTo: 'Operator-02',
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      taskNo: 'PT-2026-003',
      sku: 'PNL-3001',
      item: 'Control Panel',
      qty: 20,
      source: 'DOCK-A',
      destination: 'C-R02-S03-B01',
      assignedTo: 'Operator-03',
      priority: 'Low',
      status: 'Completed'
    }
  ];

  refresh(): void {
    console.log('refresh');
  }

  allocate(task: any): void {
    alert(`Allocate Bin for ${task.taskNo}`);
  }

  start(task: any): void {
    task.status = 'In Progress';
  }

  complete(task: any): void {
    task.status = 'Completed';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  }
}
